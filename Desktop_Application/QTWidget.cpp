
#include "QTWidget.h"


QTWidget::QTWidget(QString targetFolderName, QString referenceFolderName, QString saveFileName, QString ModalityName, QString simple) {



	itk::OutputWindow::SetInstance(itk::TextOutput::New());

	Modality = ModalityName;
	targetFileName = saveFileName;

	referenceLoaded = false;
	targetLoaded = false;

	QWidget* centralWidget = new QWidget(this);
	setCentralWidget(centralWidget);
	QGridLayout* mainlayout = new QGridLayout(centralWidget);

	// Defining a vertical toolbar that will the user will interact with...
	ImageToolBar = new QToolBar(this);
	ImageToolBar->setOrientation(Qt::Vertical);
	ImageToolBar->setMinimumWidth(200);
	/////////////////////////////////////////////////////////////////////////////////////////

	//..................... Buttons for loading target data in different formats............//				
	QGroupBox* groupBox1 = new QGroupBox(tr("1. Load Target"));
	QVBoxLayout *vbox1 = new QVBoxLayout();
	loadButton = new QPushButton(ImageToolBar);
	loadButton->setText("Load Target Folder");
	connect(loadButton, SIGNAL(clicked()), this, SLOT(loadTargetFolder())); // clicking loadButton will lauch loadDicom() for loading a dicom folder
	vbox1->addWidget(loadButton);
	loadFileButton = new QPushButton(ImageToolBar);
	loadFileButton->setText("Load Target File");
	connect(loadFileButton, SIGNAL(clicked()), this, SLOT(loadFile())); // clicking loadFileButton will lauch loadFile() for loading target image in other format
	vbox1->addWidget(loadFileButton);
	loadFileButton->setDisabled(true);
	//loadVolButton = new QPushButton(ImageToolBar);
	//loadVolButton->setText("Load *.vol Folder");
	//connect(loadVolButton, SIGNAL(clicked()), this, SLOT(loadVolFolder())); // clicking loadVolButton will lauch loadVolFolder() for loading target image in *.vol format
	//vbox1->addWidget(loadVolButton);
	groupBox1->setLayout(vbox1);
	ImageToolBar->addWidget(groupBox1);

	/* The target data can contain multiple images. A dropddown menu is provided to select a particular image from
	the pre loaded target data */
	QGroupBox* groupBox2 = new QGroupBox(tr("2. Select Target Series"));
	QVBoxLayout *vbox2 = new QVBoxLayout();
	dropdownMenu = new QComboBox(ImageToolBar);
	vbox2->addWidget(dropdownMenu);
	groupBox2->setLayout(vbox2);
	ImageToolBar->addWidget(groupBox2);

	// ............ Button for loading Reference data...............................//
	QGroupBox* groupBox5 = new QGroupBox(tr("3. Load Reference"));
	QVBoxLayout *vbox5 = new QVBoxLayout();
	QPushButton * loadButton5 = new QPushButton(ImageToolBar);
	loadButton5->setText("Load Reference Folder");
	connect(loadButton5, SIGNAL(clicked()), this, SLOT(loadReferenceFolder()));
	vbox5->addWidget(loadButton5);
	groupBox5->setLayout(vbox5);
	ImageToolBar->addWidget(groupBox5);

	// ............ Radio Buttons for choosing algorithm complexity. By default we use simple scheme..................//
	QGroupBox *groupBoxComplexity = new QGroupBox(tr("Computational Complexity"));
	QHBoxLayout *groupBoxComplexityLayout = new QHBoxLayout();
	simpleButton = new QRadioButton(tr("Simple"));
	QRadioButton *complexButton = new QRadioButton(tr("Complex"));
	groupBoxComplexityLayout->addWidget(simpleButton);
	groupBoxComplexityLayout->addWidget(complexButton);
	if (simple.isEmpty() || simple == "true" || simple == "1")
		simpleButton->setChecked(true);
	else
		simpleButton->setChecked(false);
	groupBoxComplexity->setLayout(groupBoxComplexityLayout);
	ImageToolBar->addWidget(groupBoxComplexity);

	// ............ Radio Buttons for swithcing between MR/CT. By default we use CT..................//
	QGroupBox *groupBoxScanSelection = new QGroupBox(tr("CT / MRI Selection"));
	QHBoxLayout *groupBoxScanSelectionLayout = new QHBoxLayout();
	CTButton = new QRadioButton(tr("CT"));
	MRIButton = new QRadioButton(tr("MRI"));
	groupBoxScanSelectionLayout->addWidget(CTButton);
	groupBoxScanSelectionLayout->addWidget(MRIButton);
	CTButton->setChecked(true);
	//connect(CTButton, SIGNAL(clicked()), this, SLOT(CTSelectionChanged()));
	//connect(MRIButton, SIGNAL(clicked()), this, SLOT(CTSelectionChanged()));
	groupBoxScanSelection->setLayout(groupBoxScanSelectionLayout);
	ImageToolBar->addWidget(groupBoxScanSelection);

	// ............ Button for finding target stl model .............................//
	QGroupBox* groupBox4 = new QGroupBox(tr("4. Segmentation on target Image"));
	QVBoxLayout *vbox4 = new QVBoxLayout();
	QPushButton* segmentButton = new QPushButton(ImageToolBar);
	segmentButton->setText("Generate Target Model");
	connect(segmentButton, SIGNAL(clicked()), this, SLOT(generateTargetSurface()));
	vbox4->addWidget(segmentButton);
	groupBox4->setLayout(vbox4);
	ImageToolBar->addWidget(groupBox4);

	// ............ Button for saving target stl model in hardisk.............................//
	QGroupBox* groupBox6 = new QGroupBox(tr("5. Load/Save Target Model"));
	QVBoxLayout *vbox6 = new QVBoxLayout();
	QPushButton* saveButton = new QPushButton(ImageToolBar);
	saveButton->setText("Save Target Model");
	connect(saveButton, SIGNAL(clicked()), this, SLOT(saveTargetSurface()));
	vbox6->addWidget(saveButton);
	QPushButton* loadTargetButton = new QPushButton(ImageToolBar);
	loadTargetButton->setText("Load Target Model");
	connect(loadTargetButton, SIGNAL(clicked()), this, SLOT(loadTargetSurface()));
	vbox6->addWidget(loadTargetButton);
	groupBox6->setLayout(vbox6);
	ImageToolBar->addWidget(groupBox6);

	// Once all buttons are added in the toolbar, we finally add this toolbar to our main layout
	mainlayout->addWidget(ImageToolBar, 0, 0, 3, 1);

	// Now we add four layouts containing image and model viewers in our main layout

	refImViewer = new imageWidget();
	refImViewer->setImageTitle("Reference Image");
	mainlayout->addWidget(refImViewer, 0, 1, 1, 1);

	refRenderWidget = new renderWidget();
	refRenderWidget->setModelTitle("Reference Model");
	mainlayout->addWidget(refRenderWidget, 1, 1, 1, 1);

	targetImViewer = new imageWidget();
	targetImViewer->setImageTitle("Target Image");
	mainlayout->addWidget(targetImViewer, 0, 2, 1, 1);

	targetRenderWidget = new renderWidget();
	targetRenderWidget->setModelTitle("Target Model");
	mainlayout->addWidget(targetRenderWidget, 1, 2, 1, 1);

	//	targetImViewer->setCheckBoxes(targetRenderWidget->getCheckBoxes());
	//	refImViewer->setCheckBoxes(refRenderWidget->getCheckBoxes());

	// A message box to show progress
	msgBox = new QMessageBox(this);
	msgBox->setStandardButtons(QMessageBox::Ok);


	QDesktopWidget dw;
	ImageToolBar->setFixedWidth(dw.width() / 7);
	refImViewer->setFixedHeight(dw.height() / 2);
	targetImViewer->setFixedHeight(dw.height() / 2);
	msgBox->setFixedWidth(dw.width() / 5);

	connect(this, SIGNAL(registrationCompleted()), this, SLOT(showTargetModel()));

	if (!targetFolderName.isEmpty())
		loadTargetFolder(targetFolderName);

	if (!referenceFolderName.isEmpty())
		loadReferenceFolder(referenceFolderName);

	if (referenceLoaded && targetLoaded)
		generateTargetSurface();

}

QTWidget::~QTWidget()
{
}

ImageTypeU3::Pointer QTWidget::convert3DFloatToUnsignedChar(ImageTypeF3::Pointer floatImg)
{
	// This function converts a 3D floating point image into unsigned char format

	// First we normalize an image such that it has zero mean and unit variance
	typedef itk::NormalizeImageFilter< ImageTypeF3, ImageTypeF3 >	NormalizeFilterType;
	NormalizeFilterType::Pointer normalizeFilter = NormalizeFilterType::New();
	normalizeFilter->SetInput(floatImg);
	normalizeFilter->Update();

	// The normalized image is rescaled from [-1 +1] to [0 255]
	typedef itk::RescaleIntensityImageFilter< ImageTypeF3, ImageTypeF3 >	RescaleType;
	RescaleType::Pointer rescale = RescaleType::New();
	rescale->SetInput(normalizeFilter->GetOutput());
	rescale->SetOutputMinimum(0);
	rescale->SetOutputMaximum(itk::NumericTraits< ImageTypeU3::PixelType >::max());
	rescale->Update();

	// Finally type casting is done from float to unisgned char
	typedef itk::CastImageFilter< ImageTypeF3, ImageTypeU3 > castFilterType;
	castFilterType::Pointer castfilter = castFilterType::New();
	castfilter->SetInput(rescale->GetOutput());
	castfilter->Update();
	ImageTypeU3::Pointer imageDataChar = castfilter->GetOutput();

	return imageDataChar;
}

void QTWidget::createReferenceCylinders()
{
	float Xnasopharynx = 3.0, Ynasopharynx = 4.0, Znasopharynx = -44.5, nasopharynxCylinderHeight = 8, nasopharynxCylinderRadius = 4;
	vtkSmartPointer<vtkPolyData>  nasopharynxCylinder = createCylinder(Xnasopharynx, Ynasopharynx, Znasopharynx, nasopharynxCylinderRadius, nasopharynxCylinderHeight);
	vtkSmartPointer<vtkPolyData>  nasopharynxCylinderBase = createCylinder(Xnasopharynx, Ynasopharynx, Znasopharynx + (1.5 / 2.0) - (nasopharynxCylinderHeight / 2.0), nasopharynxCylinderRadius*2.0, 2.0);

	float XLeft = -4.71, YLeft = -84.72, ZLeft = -48.25, leftCylinderHeight = 8, leftCylinderRadius = 2.5;
	vtkSmartPointer<vtkPolyData>  leftCylinder = createCylinder(XLeft, YLeft, ZLeft, leftCylinderRadius, leftCylinderHeight);
	vtkSmartPointer<vtkPolyData>  leftCylinderBase = createCylinder(XLeft, YLeft, ZLeft + (1.5 / 2.0) - (leftCylinderHeight / 2.0), leftCylinderRadius *2.0, 2.0);

	float XRight = 9.42, YRight = -83.93, ZRight = -48.25, rightCylinderHeight = 8, rightCylinderRadius = 2.5;
	vtkSmartPointer<vtkPolyData>  rightCylinder = createCylinder(XRight, YRight, ZRight, rightCylinderRadius, rightCylinderHeight);
	vtkSmartPointer<vtkPolyData>  rightCylinderBase = createCylinder(XRight, YRight, ZRight + (1.5 / 2.0) - (rightCylinderHeight / 2.0), rightCylinderRadius *2.0, 2.0);

	ImageTypeU3::Pointer leftCylinderImage = getImageFromPolyData(leftCylinder, refImage, false);
	ImageTypeU3::Pointer leftAndRightCylinderImage = getImageFromPolyData(rightCylinder, leftCylinderImage, true);
	refCylinders = getImageFromPolyData(nasopharynxCylinder, leftAndRightCylinderImage, true);

	ImageTypeU3::Pointer leftCylinderBaseImage = getImageFromPolyData(leftCylinderBase, refImage, false);
	ImageTypeU3::Pointer leftAndRightCylinderBaseImage = getImageFromPolyData(rightCylinderBase, leftCylinderBaseImage, true);
	refCylindersBoundaries = getImageFromPolyData(nasopharynxCylinderBase, leftAndRightCylinderBaseImage, true);

	//saveImage<ImageTypeU3>(refCylinders, "refCylinders.mhd");
	//saveImage<ImageTypeU3>(refCylindersBoundaries, "refCylindersBoundaries.mhd");

	//vtkSmartPointer<vtkSTLWriter> writer = vtkSmartPointer<vtkSTLWriter>::New();
	//writer->SetFileName("right.stl");
	//writer->SetInputData(rightCylinder);
	//writer->Update();



	//getVtkImageFromPolyData(nasopharynxCylinder);
}


bool QTWidget::loadReference(QString imageFileName)
{

	QFileInfo fi(imageFileName);

	QString modelName = fi.absolutePath() + "/" + fi.completeBaseName() + "Segmentation.stl";
	QFileInfo nosemodel_file(modelName);
	if (!nosemodel_file.exists())
		return false;

	// Also read the segmentation image from which that Stl model was constructed
	QString contourFileName = fi.absolutePath() + "/" + fi.completeBaseName() + "SegmentationContours.mha";
	QFileInfo contour_file(contourFileName);
	if (!contour_file.exists())
		return false;

	QString segmentationROIFileName = fi.absolutePath() + "/" + fi.completeBaseName() + "SegmentationMask.mha";
	QFileInfo segmentationROI_file(segmentationROIFileName);
	if (!segmentationROI_file.exists())
		return false;
/*
	QString noseEntranceFileName = fi.absolutePath() + "/" + fi.completeBaseName() + "NoseEntranceMask.mha";
	QFileInfo nose_file(noseEntranceFileName);
	if (!nose_file.exists())
		return false;

	QString nasopharynxFileName = fi.absolutePath() + "/" + fi.completeBaseName() + "NasopharynxMask.mha";
	QFileInfo nasopharynx_file(nasopharynxFileName);
	if (!nasopharynx_file.exists())
		return false;
		*/

	//QString cylinderFileName = fi.absolutePath() + "/" + fi.completeBaseName() + "SegmentationCylinders.mha";
	//QFileInfo cylinder_file(cylinderFileName);
	//if (!cylinder_file.exists())
	//	return false;

	//QString cylinderFileNameB = fi.absolutePath() + "/" + fi.completeBaseName() + "SegmentationCylindersBoundaries.mha";
	//QFileInfo cylinder_fileB(cylinderFileNameB);
	//if (!cylinder_fileB.exists())
	//	return false;


	// Now read the region of interest. Since we are only interested in nasal channels, in trun only a subspace of filename.mhd is used for processing 
//	QString maskFileName = fi.absolutePath() + "/" + fi.completeBaseName() + "Mask.mha";
//	QFileInfo mask_file(maskFileName);
//	if (!mask_file.exists())
//		return false;

	cout << "Folder Loaded" << endl;
	// Now read that reference filename.mhd and convert it into unsigned char format
	ImageTypeF3::Pointer refImageF3 = readImage<ImageTypeF3>(imageFileName.toStdString());
	refImage = convert3DFloatToUnsignedChar(refImageF3);
	vtkSmartPointer<vtkPolyData> surface;

	vtkSmartPointer<vtkSTLReader> reader = vtkSmartPointer<vtkSTLReader>::New();
	reader->SetFileName(modelName.toStdString().c_str());
	reader->Update();
	surface = reader->GetOutput();

	refSegmentationROI = readImage<MaskImageType3D>(segmentationROIFileName.toStdString());
	refSegmentationContours = readImage<MaskImageType3D>(contourFileName.toStdString());
	//refNoseEntranceMask = readImage<MaskImageType3D>(noseEntranceFileName.toStdString());
	//refNasopharynxMask = readImage<MaskImageType3D>(nasopharynxFileName.toStdString());
	//refMask = readImage<MaskImageType3D>(maskFileName.toStdString());
	////refNasopharynxBoundary = readImage<MaskImageType3D>(nasopharynxFileName.toStdString());
	//refCylinders = readImage<MaskImageType3D>(cylinderFileName.toStdString());
	//refCylindersBoundaries = readImage<MaskImageType3D>(cylinderFileNameB.toStdString());

	createReferenceCylinders();

	// Now add the reference surface read from filenameSegmentation.stl into the main layout
	refRenderWidget->setSurface(surface);
	refImViewer->setSurface(surface);

	// Also add the reference image into the maing layout
	refImViewer->setImage3D(refImage);

	referenceLoaded = true;

	return true;
}

void QTWidget::loadReferenceFolder(QString dirName)
{
	QStringList names;
	names << "*.mhd";
	QDirIterator it(dirName, names, QDir::Files, QDirIterator::Subdirectories);

	while (it.hasNext())
	{
		QString fName = it.next();
		cout << fName.toStdString() << endl;
		bool found = loadReference(fName);
		if (found)
			break;
	}
}

void QTWidget::loadReferenceFolder()
{
	// This function loads reference input data. It is assumed that a folder contains the following files, out of which a user
	// specifies a main image file. 
	// 1. filename.mhd (this is the reference image file that the user supplies)
	// 2. filenameSegmentation.mha (segmentation map, it is assumed that the user has already segmented nasal channels from filename.mhd)
	// 3. filenameSegmentation.stl (3D mesh resulting from filenameSegmentation.mha)
	// 4. filenameMask.mha (mask specifying region of interest, a subregion of filename.mhd)
	// A sample folder containing these files is available at (https://drive.google.com/open?id=1ZtV9UsBsSi3n15lLEd1v0q3aE97y2I1U)

	// Open a dialog box and ask user for the specific dicom folder
	QString dirName = QFileDialog::getExistingDirectory(this, "Load Reference Folder", "");
	if (dirName.isEmpty()) {
		cout << "Required files are not in this directory" << endl;
		return;
	}
	loadReferenceFolder(dirName);
}

void QTWidget::showTargetModel()
{
	cout << "Showing the target model in a second" << endl;
	// After computing targetSurface, add it into main layout
	targetRenderWidget->setSurface(targetSurfaces[1]);
	targetImViewer->setSurface(targetSurfaces[1]);
	cout << "updating contours" << endl;
	// update image viewer to overlay the contours of newly computed target surface
	targetImViewer->updateQImage();

}

ImageTypeU3::Pointer QTWidget::resampleImage(ImageTypeU3::Pointer image, bool isBinary)
{

	ImageTypeU3::SpacingType inputSpacing = image->GetSpacing();
	ImageTypeU3::SpacingType outputSpacing;
	float minSpacing = std::max(std::min(std::min(inputSpacing[0], inputSpacing[1]), inputSpacing[2]), 0.30);
	outputSpacing[0] = minSpacing;
	outputSpacing[1] = minSpacing;
	outputSpacing[2] = minSpacing;


	ImageTypeU3::SizeType inputSize = image->GetLargestPossibleRegion().GetSize();
	ImageTypeU3::SizeType outputSize;
	outputSize[0] = (inputSpacing[0] * (float)inputSize[0]) / (float)outputSpacing[0];
	outputSize[1] = (inputSpacing[1] * (float)inputSize[1]) / (float)outputSpacing[1];
	outputSize[2] = (inputSpacing[2] * (float)inputSize[2]) / (float)outputSpacing[2];

	//image.Print(cout);



	typedef itk::ResampleImageFilter<ImageTypeU3, ImageTypeU3 > ResampleFilterType;
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double >  InterpolatorType;
	typedef itk::NearestNeighborInterpolateImageFunction<MaskImageType3D, double >  NNInterpolatorType;

	NNInterpolatorType::Pointer interpolatorNN = NNInterpolatorType::New();
	InterpolatorType::Pointer interpolatorLinear = InterpolatorType::New();
	ResampleFilterType::Pointer filter = ResampleFilterType::New();
	if (isBinary)
		filter->SetInterpolator(interpolatorNN);
	else
		filter->SetInterpolator(interpolatorLinear);

	//filter->SetDefaultPixelValue(255);
	filter->SetOutputOrigin(image->GetOrigin());
	filter->SetOutputSpacing(outputSpacing);
	filter->SetOutputDirection(image->GetDirection());
	filter->SetSize(outputSize);
	// Software Guide : EndCodeSnippet
	filter->SetInput(image);
	//filter->SetTransform(compositeTransform);
	filter->Update();
	ImageTypeU3::Pointer out = filter->GetOutput();
	//out.Print(cout);

	return filter->GetOutput();
	//saveImage<ImageTypeU3>(movingAffine, "registeredAffine.mhd");
}

void QTWidget::registrationFunction()
{

	float metricValue;
	//vector<vtkSmartPointer<vtkPolyData>> targetSurfacesOld;
	// This function generates a target surface which is tha main objective of the software
	//vector<ImageTypeU3::PointType> cylinderCenters;
	try
	{
		targetSurfaces = findSurfaceOnTarget(
			resampleImage(targetImViewer->getImage3D(), false),
			resampleImage(refImViewer->getImage3D(), false),
			resampleImage(refSegmentationROI, true),
			resampleImage(refSegmentationContours, true),
		//	resampleImage(refMask, true),
			resampleImage(refCylinders, true),
			resampleImage(refCylindersBoundaries, true),
		//	resampleImage(refNoseEntranceMask, true),
		//	resampleImage(refNasopharynxMask, true),
			simpleButton->isChecked(),
			CTButton->isChecked(),
			metricValue,
			cylinderCenters
		);


		//targetSurfaceOld = findSurfaceOnTarget(targetImViewer->getImage3D(),
		//	refImViewer->getImage3D(),
		//	refSegmentation,
		//	refSegmentationNasopharynx,
		//	refMask,
		//	simpleButton->isChecked(),
		//	CTButton->isChecked(),
		//	metricValue);

		//vtkSmartPointer<vtkPolyData>  targetSurface1 = decimation(laplacianSmooth(targetSurfaceOld,0.1));
	}
	catch (itk::ExceptionObject & err)
	{
		std::cerr << "ExceptionObject caught during registration! Run again..." << std::endl;
		std::cerr << err << std::endl;
		ImageToolBar->setDisabled(false);
		msgBox->hide();
		return;
	}


	if (!targetFileName.isEmpty())
		saveTargetSurface(targetFileName);


	ImageToolBar->setDisabled(false);
	msgBox->hide();

	if (metricValue > -0.45)
	{
		msgBox->setWindowTitle(tr("Warning"));
		msgBox->setText("Metric Value too low..... Optimizer may no have converged to a good match \t \t");
		msgBox->show();
	}

	registrationThread->detach();
	delete registrationThread;
	cout << "Registration completed" << endl;
	emit registrationCompleted();
}

void QTWidget::generateTargetSurface()
{
	if (targetLoaded && referenceLoaded)
	{
		registrationThread = new std::thread(&QTWidget::registrationFunction, this);
		msgBox->setWindowTitle(tr("Registration"));
		msgBox->setText("Registration in Progress.... \t \t \t");
		msgBox->show();
		ImageToolBar->setDisabled(true);
	}
	else
	{
		msgBox->setText("Check if the Target or Reference Image is valid");
		msgBox->setWindowTitle("Error");
		msgBox->show();
	}
}


void QTWidget::saveTargetSurface(QString dirName)
{
	cout << dirName.toStdString() << endl;

	//QFileInfo fi(dirName);
	//QString dirName = fi.absolutePath();
	if (!QDir(dirName).exists())
		QDir().mkdir(dirName);

	FILE * s1;
	QString fileName1 = dirName + "/" + QString("centers.txt");
	s1 = fopen(fileName1.toStdString().c_str(), "w");

	fprintf(s1, "%8.8f %8.8f %8.8f\n%8.8f %8.8f %8.8f\n%8.8f %8.8f %8.8f",
		cylinderCenters[0][0], cylinderCenters[0][1], cylinderCenters[0][2],
		cylinderCenters[1][0], cylinderCenters[1][1], cylinderCenters[1][2],
		cylinderCenters[2][0], cylinderCenters[2][1], cylinderCenters[2][2]
	);

	fclose(s1);

	vector<QString> names;
	names.push_back(dirName + "/file1_normal.stl");
	//names.push_back(dirName + "/file2_cylinders_pancakes.stl");
	//names.push_back(dirName + "/file3_nose_entrance.stl");
	//names.push_back(dirName + "/file4_nasopharynx.stl");
	names.push_back(dirName + "/file5_cylinders.stl");

	for (int i = 0; i < targetSurfaces.size(); i++)
	{
		//cout << "surface " << names[i].toStdString() << endl;
		//targetSurfaces[i]->Print(cout);
		vtkSmartPointer<vtkSTLWriter> writer = vtkSmartPointer<vtkSTLWriter>::New();
		writer->SetFileName(names[i].toStdString().c_str());
		writer->SetInputData(targetSurfaces[i]);
		writer->Update();
	}


}

void QTWidget::saveTargetSurface()
{

	// This function saves the target stl model into hardisk
	if (targetSurfaces[0])
	{
		// ask user to specify filename in a dialog box
		QString dirName = QFileDialog::getExistingDirectory(this, "Specify Folder to save files", "");
		if (dirName.isEmpty())
			return;

		saveTargetSurface(dirName);
	}
	else
	{
		msgBox->setText("Target Surface does not exists");
		msgBox->setWindowTitle("Error");
		msgBox->show();
	}
}

void QTWidget::selectLargestConnectedComponent(vtkSmartPointer<vtkPolyData> &polyData)
{
	vtkSmartPointer<vtkPolyDataConnectivityFilter> connectivityFilter = vtkSmartPointer<vtkPolyDataConnectivityFilter>::New();
	connectivityFilter->SetInputData(polyData);
	connectivityFilter->SetExtractionModeToLargestRegion();
	connectivityFilter->Update();
	polyData = connectivityFilter->GetOutput();

	//    vtkIdTypeArray *regionSizes=connectivityFilter->GetRegionSizes();
	//    for(vtkIdType i=0;i<connectivityFilter->GetNumberOfExtractedRegions();i++){
	//        std::cout << "N cells region" << i << " = " << regionSizes->GetTuple1(i) << std::endl;
	//    }
}

void QTWidget::loadTargetSurface()
{
	// This function loads the target stl model from hardisk

	// ask user to specify filename in a dialog box
	QString fileName = QFileDialog::getOpenFileName(this, "Load Stl file", "", "STL files (*.stl)");
	if (fileName.isEmpty())
		return;

	vtkSmartPointer<vtkSTLReader> reader = vtkSmartPointer<vtkSTLReader>::New();
	reader->SetFileName(fileName.toStdString().c_str());
	reader->Update();
	//targetSurface = laplacianSmooth(reader->GetOutput());
	//vtkSmartPointer<vtkPolyData> targetSurfaceOld = decimation(laplacianSmooth(reader->GetOutput()));

	//targetSurface = decimation(laplacianSmooth(targetSurfaceOld));
	//selectLargestConnectedComponent(targetSurface);
	//targetSurface = targetSurfaceOld;

	// After computing targetSurface, add it into main layout
	targetRenderWidget->setSurface(reader->GetOutput());
	targetImViewer->setSurface(reader->GetOutput());

	// update image viewer to overlay the contours of newly computed target surface
	targetImViewer->updateQImage();


}

void QTWidget::loadTargetFolder(QString dirName)
{
	// clear all target image series and also clear the drop down menu before that..... 
	disconnect(dropdownMenu, SIGNAL(currentIndexChanged(int)), this, SLOT(selectImage(int)));
	dropdownMenu->clear();
	areImagesCT.clear();
	connect(dropdownMenu, SIGNAL(currentIndexChanged(int)), this, SLOT(selectImage(int)));
	targetImages.clear();

	loadDicomFolder(dirName);
	loadVolFolder(dirName);

	QDir rootDir(dirName);
	rootDir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
	QDirIterator it(rootDir, QDirIterator::Subdirectories);
	while (it.hasNext())
	{
		QString fName = it.next();
		cout << fName.toStdString() << endl;
		loadDicomFolder(fName);
		loadVolFolder(fName);
	}

	// finds the series which has largest number of pixels
	int maxPixels = 0;
	int maxIndex = 0;
	for (int i = 0; i < targetImages.size(); i++)
	{
		ImageTypeU3::SizeType sz = targetImages[i]->GetLargestPossibleRegion().GetSize();
		int currentPixels = sz[0] * sz[1] * sz[2];
		if (maxPixels < currentPixels)
		{
			maxPixels = currentPixels;
			maxIndex = i;
		}
	}

	// set image with max number of pixels as defult item in the drop down menu
	if (targetImages.size() >= 1)
	{
		dropdownMenu->setCurrentIndex(maxIndex);
		if (Modality.isEmpty())
		{
			MRIButton->setChecked(!areImagesCT[maxIndex]);
			CTButton->setChecked(areImagesCT[maxIndex]);
		}
		else
		{
			if (Modality == "CT")
			{
				MRIButton->setChecked(false);
				CTButton->setChecked(true);
			}
			else
			{
				MRIButton->setChecked(true);
				CTButton->setChecked(false);
			}
		}
	}
}

void QTWidget::loadTargetFolder()
{

	// Open a dialog box and ask user for the specific dicom folder
	QString dirName = QFileDialog::getExistingDirectory(this, "Load Target Folder", "");
	if (dirName.isEmpty())
		return;

	loadTargetFolder(dirName);
}

void QTWidget::loadFile()
{

	// clear all target image series and also clear the drop down menu before that..... 
	disconnect(dropdownMenu, SIGNAL(currentIndexChanged(int)), this, SLOT(selectImage(int)));
	dropdownMenu->clear();
	areImagesCT.clear();
	// whenever the user changes an item in the drop down menu, the function selectImage() is called
	connect(dropdownMenu, SIGNAL(currentIndexChanged(int)), this, SLOT(selectImage(int)));
	targetImages.clear();

	// open a dialog box and ask user to specify file name of new target image
	QString imageFileName = QFileDialog::getOpenFileName(this, "Load image", "", "All files (*.*)");
	if (imageFileName.isEmpty())
		return;

	// read target image
	ImageTypeF3::Pointer refImageF3 = readImage<ImageTypeF3>(imageFileName.toStdString());

	// add the target image to the dropdown menu
	targetImages.push_back(convert3DFloatToUnsignedChar(refImageF3));
	dropdownMenu->addItem(QString(std::to_string(targetImages.size()).c_str()));
	areImagesCT.push_back(true);

	// set the 1st image of the series in dropdown menu
	if (targetImages.size() >= 1)
		dropdownMenu->setCurrentIndex(0);

	MRIButton->setChecked(false);
	CTButton->setChecked(true);
}

void QTWidget::loadVolFolder(QString dirName)
{

	// Now follows the implementation for opening .vol folder. It is assumed that the user has already extracted all the slices
	// from the folder using ODViewer.exe (ODViewer can be found in the root directory e.g. in CT_N1/Jelena Sabalina_20150831161204.SL.
	// Double Click on ODViewer.exe and click on Export Slices from the file menu and specify a folder to extract all slices. 
	// Then specify this folder in the dialogbox below....

	// First we have to specify voxel spacing along each axis in mm. Currently we are using isotropic voxel spacing. 
	// The exact value can be found in a text file photo_proc.txt which is also present in the root directory.
	float pixelSpacing = 0.25;

	// We will stack all 2D slices belonging to Z axis and create a 3D volume out of that stack. The convention of slice naming
	// is as follows... SLZmin.BMP to SLZmax.BMP 

	// First real all the slices along - negative Z axis
	int i = 1;
	string fileName = dirName.toStdString() + "/SLZ-00" + to_string(i) + ".BMP";
	vector<string> temp, zFileNames;
	if (!itksys::SystemTools::FileExists(fileName.c_str()))
		return;

	while (itksys::SystemTools::FileExists(fileName.c_str()))
	{
		temp.push_back(fileName);
		i = i + 1;
		fileName = to_string(i);
		while (fileName.length() < 3)
			fileName = "0" + fileName;
		fileName = dirName.toStdString() + "/SLZ-" + fileName + ".BMP";
	}
	for (int j = temp.size() - 1; j >= 0; j--)
		zFileNames.push_back(temp[j]);

	// Now read all slices along +positive Z axis
	i = 0;
	fileName = dirName.toStdString() + "/SLZ+00" + to_string(i) + ".BMP";
	while (itksys::SystemTools::FileExists(fileName.c_str()))
	{
		zFileNames.push_back(fileName);
		i = i + 1;
		fileName = to_string(i);
		while (fileName.length() < 3)
			fileName = "0" + fileName;
		fileName = dirName.toStdString() + "/SLZ+" + fileName + ".BMP";
	}

	// Create a 3D volume of stack of 2D slices
	typedef itk::TileImageFilter< ImageTypeF2, ImageTypeF3 > TilerType;
	TilerType::Pointer tiler = TilerType::New();
	itk::FixedArray< unsigned int, 3 > layout;
	layout[0] = 1;
	layout[1] = 1;
	layout[2] = 0;
	tiler->SetLayout(layout);
	unsigned int inputImageNumber = 0;
	ImageTypeF2::Pointer inputImageTile;
	for (int j = 0; j < zFileNames.size(); j++)
	{
		inputImageTile = readImage<ImageTypeF2>(zFileNames[j]);
		inputImageTile->DisconnectPipeline();
		tiler->SetInput(inputImageNumber++, inputImageTile);
	}
	tiler->SetDefaultPixelValue(128);
	tiler->Update();
	ImageTypeF3::Pointer outImage3D = tiler->GetOutput();

	// Specify voxel spacing of 0.25mm in all 3 directions
	ImageTypeF3::SpacingType sp;
	sp[0] = pixelSpacing; sp[1] = pixelSpacing; sp[2] = pixelSpacing * 2; // 0.5mm along z axis
	typedef itk::ChangeInformationImageFilter< ImageTypeF3 > FilterType;
	FilterType::Pointer filter = FilterType::New();
	filter->SetInput(outImage3D);
	filter->SetOutputSpacing(sp);
	filter->ChangeSpacingOn();
	filter->UpdateOutputInformation();

	// add the 3D volume in the dropdown menu
	//saveImage<ImageTypeF3>(filter->GetOutput(), "Image3D.mhd");
	targetImages.push_back(convert3DFloatToUnsignedChar(filter->GetOutput()));

	areImagesCT.push_back(true);

	dropdownMenu->addItem(QString(std::to_string(targetImages.size()).c_str()));


}

void QTWidget::loadDicomFolder(QString dirName)
{

	// This function reads all image series present within a dicom folder



	// Get id of each series
	typedef itk::GDCMSeriesFileNames NamesGeneratorType;
	NamesGeneratorType::Pointer nameGenerator = NamesGeneratorType::New();
	nameGenerator->SetUseSeriesDetails(true);
	nameGenerator->SetDirectory(dirName.toStdString());

	std::cout << std::endl << "The directory: " << std::endl;
	std::cout << std::endl << dirName.toStdString() << std::endl << std::endl;
	std::cout << "Contains the following DICOM Series: ";
	std::cout << std::endl << std::endl;

	// For each series, we will read 2D images and itk will stack those to create a 3D volume internally. 
	// Physical spacing will also be handled internally by itk....
	typedef itk::ImageSeriesReader< ImageTypeF3 >  ReaderType;
	typedef std::vector< std::string >    SeriesIdContainer;
	const SeriesIdContainer & seriesUID = nameGenerator->GetSeriesUIDs();
	SeriesIdContainer::const_iterator seriesItr = seriesUID.begin();
	SeriesIdContainer::const_iterator seriesEnd = seriesUID.end();
	//cout << "1 " << endl;

	while (seriesItr != seriesEnd)
	{
		//cout << "2 " << endl;
		std::cout << seriesItr->c_str() << std::endl;
		//cout << "3 " << endl;
		typedef std::vector< std::string >   FileNamesContainer;
		FileNamesContainer fileNames;
		fileNames = nameGenerator->GetFileNames(seriesItr->c_str());

		ReaderType::Pointer reader = ReaderType::New();
		typedef itk::GDCMImageIO       ImageIOType;
		ImageIOType::Pointer dicomIO = ImageIOType::New();
		reader->SetImageIO(dicomIO);
		reader->SetFileNames(fileNames);
		reader->Update();
		ImageTypeF3::Pointer outImage = reader->GetOutput();

		// Even though physical spacing should be handled by itk internally, for some reasons I noticed that the spacing along z axis
		// is not set properly by itk for rawCT\su2017\Alyaev Sergei\20170920\1.2.826.0.1.3680043.2.594.19502.18272.3776.26046.20841
		// May be its a bug in itk that needs to be addressed. Anyhow for the moment we will set the pixel spacing along z axis explicitly.
		// For that dicom tag "0018|0050" will provide the value of slice thickness which we can use as pixel spacing along z axis...
		float sliceThickness = 0;
		std::string tagkey = "0018|0050"; // slice thickness tag
		std::string labelId;
		if (itk::GDCMImageIO::GetLabelFromTag(tagkey, labelId))
		{
			std::string value;
			//std::cout << labelId << " (" << tagkey << "): ";
			if (dicomIO->GetValueFromTag(tagkey, value))
				sliceThickness = atof(value.c_str());
		}
		if (sliceThickness != 0)
		{
			ImageTypeF3::SpacingType outSp = outImage->GetSpacing();
			if (outSp[2] == 1)
			{
				typedef itk::ChangeInformationImageFilter< ImageTypeF3 > FilterType;
				FilterType::Pointer filter = FilterType::New();
				filter->SetInput(outImage);
				outSp[2] = sliceThickness;
				filter->ChangeSpacingOn();
				filter->SetOutputSpacing(outSp);
				filter->Update();
				// convert the new volume into unsigned char format and add it in the drop down menu
				targetImages.push_back(convert3DFloatToUnsignedChar(filter->GetOutput()));
			}
			else
				targetImages.push_back(convert3DFloatToUnsignedChar(outImage));
		}
		else
			targetImages.push_back(convert3DFloatToUnsignedChar(outImage));

		bool isCT = true;
		tagkey = "0008|0060";
		if (itk::GDCMImageIO::GetLabelFromTag(tagkey, labelId))
		{
			std::string value;
			//std::cout << labelId << " (" << tagkey << "): ";
			if (dicomIO->GetValueFromTag(tagkey, value))
			{
				if (value != "CT")
				{
					isCT = false;
					cout << isCT << endl;
					cout << tagkey << "\t" << value << endl;
				}
			}
		}

		areImagesCT.push_back(isCT);
		dropdownMenu->addItem(QString(seriesItr->c_str()));
		++seriesItr;
	}


}

void QTWidget::selectImage(int index)
{
	// whenever the user changes an item in the drop down menu, the function selectImage() is called

	//cout << "image index changed " << index << endl;

	MRIButton->setChecked(!areImagesCT[index]);
	CTButton->setChecked(areImagesCT[index]);

	// A change in the target image suggests that the surface belonging to the previous image should also be removed  from the rendering widgets
	targetRenderWidget->setSurface(NULL);
	targetImViewer->setSurface(NULL);

	// index is the current index of the image selected by the user. We set that 3D image in our target image viewer 
	targetImViewer->setImage3D(targetImages[index]);

	targetImViewer->setImageTitle("Target Image (" + dropdownMenu->currentText() + ")");

	if (targetImages[index]->GetLargestPossibleRegion().GetSize()[2] <= 5)
		targetLoaded = false;
	else
		targetLoaded = true;
}