
#include "renderWidget.h"

renderWidget::renderWidget()  {

	renderer = vtkSmartPointer<vtkRenderer>::New();

	QWidget* centralWidget = new QWidget(this);
	setCentralWidget(centralWidget);
	QVBoxLayout* mainLayout = new QVBoxLayout(centralWidget);

	groupBox = new QGroupBox(tr("Model"));
	mainLayout->addWidget(groupBox);

	QVBoxLayout* layout = new QVBoxLayout(groupBox);
	QVtkView = new QVTKWidget(this);
	layout->addWidget(QVtkView);

	groupBox->setLayout(layout);

	QVtkView->GetRenderWindow()->AddRenderer(renderer);

}

renderWidget::~renderWidget()
{
}

void renderWidget::setModelTitle(QString text)
{
	groupBox->setTitle(text);

}

void renderWidget::setSurface(vtkSmartPointer<vtkPolyData> inputSurface)
{
	vtkSurface = inputSurface;

	renderer->RemoveAllViewProps();
	renderer->RemoveAllObservers();
	renderer->Clear();

	if (inputSurface == NULL)
	{
		QVtkView->update();
		return;
	}

	// Set red color to all  Points of the surface
	vtkSmartPointer<vtkFloatArray> scalars = vtkSmartPointer<vtkFloatArray>::New();
	int numPts = vtkSurface->GetNumberOfPoints();
	scalars->SetNumberOfValues(numPts);
	for (int i = 0; i < numPts; ++i){
		scalars->SetValue(i, 0.0);
	}
	vtkSurface->GetPointData()->SetScalars(scalars);

	vtkSmartPointer<vtkPolyDataMapper> surfaceMapper = vtkSmartPointer<vtkPolyDataMapper>::New();
	surfaceMapper->SetInputData(vtkSurface);
	surfaceMapper->Update();
	
	vtkSmartPointer<vtkActor> surfaceActor =	vtkSmartPointer<vtkActor>::New();
	surfaceActor->SetMapper(surfaceMapper);

	renderer->AddActor(surfaceActor);
	
	renderer->ResetCamera();

	QVtkView->update();

}