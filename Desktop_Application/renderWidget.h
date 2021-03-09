#pragma once

#include <QObject>
#include <QCheckBox>
#include <QMainWindow>
#include <QProgressBar>
#include <QToolBar>
#include <QMutex>
#include <QTime>
#include <QRadioButton>
#include <QGroupBox>
#include <QPushButton>
#include <QGridLayout>
#include <QSlider>
#include <QGraphicsScene>
#include <QGraphicsView>
#include <QVBoxLayout>
//#include <Q4VTKWidgetPlugin.h>
#include <QVTKWidget.h>

#include <vtkObject.h>
#include <vtkObjectFactory.h>
#include <vtkSmartPointer.h>
#include <vtkImageData.h>
#include <vtkPolyData.h>
#include <vtkSTLReader.h>
#include <vtkPolyDataMapper.h>
#include <vtkActor.h>
#include <vtkRenderWindow.h>
#include <vtkRenderer.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkPlane.h>
#include <vtkPlaneSource.h>
#include <vtkCamera.h>
#include <vtkProperty.h>
#include <vtkUnsignedCharArray.h>
#include <vtkPointData.h>
#include <vtkFloatArray.h>
#include <vtkGenericDataArray.h>

#include "itkImage.h"
#include "itkResampleImageFilter.h"
#include <itkRGBPixel.h>
#include <itkExtractImageFilter.h>
#include <itkImageFileReader.h>
#include <itkImageFileWriter.h>
#include <itkImageToVTKImageFilter.h>
#include "itkCastImageFilter.h"
#include "itkRescaleIntensityImageFilter.h"


class renderWidget : public QMainWindow {

	Q_OBJECT

public:

	//default constructor
	renderWidget();
	~renderWidget();

	void setSurface(vtkSmartPointer<vtkPolyData>);
	void setModelTitle(QString);

private:

	vtkSmartPointer<vtkPolyData> vtkSurface;
	vtkSmartPointer<vtkRenderer> renderer;
	QGroupBox* groupBox;
	QVTKWidget* QVtkView;

};
