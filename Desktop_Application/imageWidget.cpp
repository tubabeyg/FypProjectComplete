
#include "imageWidget.h"

imageWidget::imageWidget()  {

	// By defult no surface is set 
	isSurfaceAvailable = false;

	QWidget* centralWidget = new QWidget(this);
	setCentralWidget(centralWidget);
	QVBoxLayout* mainLayout = new QVBoxLayout(centralWidget);

	// Define a group box containing QGraphicsScene encapsulated within QGraphicsView and the slider to scroll thorough the slices
	groupBox = new QGroupBox(tr("Image"));
	mainLayout->addWidget(groupBox);
	scene = new QGraphicsScene;
	view = new QGraphicsView(scene);
	QVBoxLayout* layout = new QVBoxLayout(groupBox);
	layout->addWidget(view);

	QGroupBox* horizontalBox = new QGroupBox();
	QHBoxLayout* horizontallayout = new QHBoxLayout(horizontalBox);

	sliceSlider = new QSlider();
	sliceSlider->setOrientation(Qt::Horizontal);
	sliceSlider->setDisabled(true);
	horizontallayout->addWidget(sliceSlider);
	showBox = new QCheckBox();
	showBox->setText("Show Contours");
	showBox->setChecked(true);
	showBox->setDisabled(true);
	horizontallayout->addWidget(showBox);
	horizontalBox->setLayout(horizontallayout);

	layout->addWidget(horizontalBox);
	groupBox->setLayout(layout);

	
	// connect the slider to the updateQImage() function. As soon as slider changes value, the new value is passed to updateQImage(int)
	connect(sliceSlider, SIGNAL(valueChanged(int)), this, SLOT(updateQImage(int)));
	connect(showBox, SIGNAL(clicked()), this, SLOT(updateQImage()));
}

imageWidget::~imageWidget()
{
}



void imageWidget::updateQImage()
{
	if (input3DImage)
	{
		// updates current view
		sliceSlider->setValue(sliceSlider->value() + 1);
		sliceSlider->setValue(sliceSlider->value() - 1);
	}
}

void imageWidget::updateQImage(int sliceNumber)
{
	// updates current view to the specified slice
	sliceno = sliceNumber;
//	qDebug() << "Slice Number: " << sliceno;
	// First we extract a 2D slice from the 3D image
	InputImageTypeChar::IndexType desiredStart;
	desiredStart[0] = 0;
	desiredStart[1] = 0;
	desiredStart[2] = sliceNumber - 1;
	InputImageTypeChar::SizeType desiredSize;
	desiredSize[0] = input3DImage->GetLargestPossibleRegion().GetSize()[0];
	desiredSize[1] = input3DImage->GetLargestPossibleRegion().GetSize()[1];
	desiredSize[2] = 0;
    InputImageTypeChar::RegionType desiredRegion(desiredStart, desiredSize);
	typedef itk::ExtractImageFilter< InputImageTypeChar, InputImageType2DChar > FilterType;
	FilterType::Pointer filter = FilterType::New();
	filter->SetExtractionRegion(desiredRegion);
	filter->SetInput(input3DImage);
#if ITK_VERSION_MAJOR >= 4
	filter->SetDirectionCollapseToIdentity(); // This is required.
#endif
	filter->Update();
	InputImageType2DChar::Pointer imageData = filter->GetOutput();

	// convert the extracted grayscale 2D image into RGB channel image
	typedef itk::CastImageFilter< InputImageType2DChar, InputImageType2DC3 > castFilterType;
	castFilterType::Pointer castfilter = castFilterType::New();
	castfilter->SetInput(imageData);
	castfilter->Update();
	InputImageType2DC3::Pointer imageDataChar = castfilter->GetOutput();

	// if an stl model is available, overlay the contours on the current slice
	if (isSurfaceAvailable && showBox->isChecked())
		imageDataChar = addSurfaceToImage(imageDataChar, sliceNumber);

	// convert from itk to vtk image format
	typedef itk::ImageToVTKImageFilter<InputImageType2DC3> ITKtoVTKImageConverterType;
	ITKtoVTKImageConverterType::Pointer ITKtoVTKImageConverterter = ITKtoVTKImageConverterType::New();
	ITKtoVTKImageConverterter->SetInput(imageDataChar);
	ITKtoVTKImageConverterter->Update();
	vtkSmartPointer<vtkImageData> vtkData = ITKtoVTKImageConverterter->GetOutput();

	// convert from ctk image format to Qimage format
	QImage imQ = vtkImageDataToQImage(vtkData);

	// add the QImage to the scene and set the scene in view
	scene->addPixmap(QPixmap::fromImage(imQ));
	scene->setSceneRect(imQ.rect());
	view->setScene(scene);

}

InputImageType2DC3::Pointer imageWidget::addSurfaceToImage(InputImageType2DC3::Pointer imgData, int sliceNumber)
{
	// This function extracts a particular slice along z axis from the stl model and overlays it with the corresponding 2D image slice (imgData)
	
	// First we specify the physical parameters of the plane. A vtk plane is specified by origin in physical and a normal.
	// Since the plane is to be extracted along the Z axis, We specify origin of the plane as the the physcial point in the input 
	// volume corresponding to [0, 0, sliceNumber-1] and the normal using the directional matrix of the volume.

	// Specifying Origin of the plane
	InputImageTypeChar::IndexType ind;
	ind[0] = 0; ind[1] = 0; ind[2] = sliceNumber-1;
	InputImageTypeChar::PointType pt;
	input3DImage->TransformIndexToPhysicalPoint(ind, pt);

	// Specify normal of the plane
	vtkSmartPointer<vtkPlane> plane = vtkSmartPointer<vtkPlane>::New();
	plane->SetOrigin(pt[0], pt[1], pt[2]);
	plane->SetNormal(input3DImage->GetDirection()(0, 2), input3DImage->GetDirection()(1, 2), input3DImage->GetDirection()(2, 2));

	// Use cutter to extract a 2D surface from a 3D stl model using the plane calculated above
	vtkSmartPointer<vtkCutter> cutter =	vtkSmartPointer<vtkCutter>::New();
	cutter->SetCutFunction(plane);
	cutter->SetInputData(vtkSurface);
	cutter->Update();
	vtkSmartPointer<vtkPolyData> surface2D = cutter->GetOutput();

	// Iterate through each point of the 2D contour and set the pixel intensities of the input 2D imgData to red color
	InputImageType2DC3::PointType pt2D;
	InputImageType2DC3::IndexType ind2D;
	InputImageType2DC3::PixelType px2D;
	px2D[0] = 255; px2D[1] = 0; px2D[2] = 0;

	for (vtkIdType i = 0; i < surface2D->GetNumberOfPoints(); i++)
	{
		double p[3];
		surface2D->GetPoint(i, p);

		pt[0] = p[0]; pt[1] = p[1]; pt[2] = p[2];
		input3DImage->TransformPhysicalPointToIndex(pt, ind);
		ind2D[0] = ind[0]; ind2D[1] = ind[1];

		imgData->SetPixel(ind2D, px2D);

	}

	return imgData;

}

void imageWidget::setImageTitle(QString text)
{
	// sets title of the group box
	groupBox->setTitle(text);
}

void imageWidget::setImage3D(InputImageTypeChar::Pointer img)
{
	if (img)
	{
		sliceSlider->setDisabled(false);

		// clear the scene
		scene->clear();

		// set input image
		input3DImage = img;

		// set slider range and show middle Z slice as default 
		sliceSlider->setRange(1, input3DImage->GetLargestPossibleRegion().GetSize()[2]);
		sliceSlider->setValue(input3DImage->GetLargestPossibleRegion().GetSize()[2] / 2);
	}
}

InputImageTypeChar::Pointer imageWidget::getImage3D()
{
	return input3DImage;
}

void imageWidget::setSurface(vtkSmartPointer<vtkPolyData> inputSurface)
{
	// sets a new stl model
	vtkSurface = inputSurface;
	if (inputSurface == NULL)
	{
		isSurfaceAvailable = false;
		showBox->setDisabled(true);
	}
	else
	{
		isSurfaceAvailable = true;
		showBox->setDisabled(false);
	}

}

QImage imageWidget::vtkImageDataToQImage(vtkSmartPointer<vtkImageData> imageData)
{
	// This function converts a 2D vtk image data to Q image data
	if (!imageData) { return QImage(); }

	int width = imageData->GetDimensions()[0];
	int height = imageData->GetDimensions()[1];
	QImage image(width, height, QImage::Format_RGB32);
	QRgb *rgbPtr =
		reinterpret_cast<QRgb *>(image.bits()) + width * (height - 1);
	unsigned char *colorsPtr =
		reinterpret_cast<unsigned char *>(imageData->GetScalarPointer());

	// Loop over the vtkImageData contents.
	for (int row = 0; row < height; row++)
	{
		for (int col = 0; col < width; col++)
		{
			// Swap the vtkImageData RGB values with an equivalent QColor
			*(rgbPtr++) = QColor(colorsPtr[0], colorsPtr[1], colorsPtr[2]).rgb();
			colorsPtr += imageData->GetNumberOfScalarComponents();
		}

		rgbPtr -= width * 2;
	}

	return image;
}
