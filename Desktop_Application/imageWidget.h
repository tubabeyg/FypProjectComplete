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
#include <QDebug>


#include "itkImage.h"
#include "itkResampleImageFilter.h"
#include <itkRGBPixel.h>
#include <itkExtractImageFilter.h>
#include <itkImageFileReader.h>
#include <itkImageFileWriter.h>
#include <itkImageToVTKImageFilter.h>
#include "itkCastImageFilter.h"
#include "itkRescaleIntensityImageFilter.h"

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
#include <vtkImageReslice.h>
#include <vtkPlane.h>
#include <vtkCutter.h>
#include <vtkSTLWriter.h>
#include <vtkTransform.h>
#include <vtkTransformPolyDataFilter.h>
#include <vtkMatrix4x4.h>

typedef   unsigned char  PixelTypeChar;
typedef itk::RGBPixel<unsigned char> RGBPixelType;
typedef   itk::Image< PixelTypeChar, 3 >     InputImageTypeChar;
typedef   itk::Image< PixelTypeChar, 2 > InputImageType2DChar;
typedef   itk::Image< RGBPixelType, 3 >      InputImageTypeC3;
typedef   itk::Image< RGBPixelType, 2 >    InputImageType2DC3;



class imageWidget : public QMainWindow {

	Q_OBJECT

public:

	//default constructor
	imageWidget();
	~imageWidget();
	void setImage3D(InputImageTypeChar::Pointer); // loads a 3D unisgned char type volume into the widget
	InputImageTypeChar::Pointer getImage3D(); // returns current 3D volume uploaded in the widget
	void setImageTitle(QString); // sets the display name of the widget
	void setSurface(vtkSmartPointer<vtkPolyData>); // sets the stl model / surface for current image
	
private:
	QImage vtkImageDataToQImage(vtkSmartPointer<vtkImageData>); // converts a vtk image data into Q image format
	InputImageType2DC3::Pointer addSurfaceToImage(InputImageType2DC3::Pointer, int);  //overlays the contours of the surface on a particular 2D slice

	vtkSmartPointer<vtkPolyData> vtkSurface; // current stl model, can be set through setSurface() function
	bool isSurfaceAvailable; // flag to specify if stl model is loaded or not
	InputImageTypeChar::Pointer input3DImage; // current 3D image, accessible through setImage3D and getImage3D functions
	QSlider * sliceSlider; // slider for scrolling through each slice of the 3D volume
	int sliceno; //variable that stores the slice number
	QCheckBox * showBox;
	QGraphicsScene *scene; // current scene of the viewer
	QGraphicsView* view; // current view of the viewer
	QGroupBox* groupBox; // group box of view and slider
	

protected slots:
	void updateQImage(int); // updates current slice w.r.t to the scroller

public slots:
	void updateQImage(); // updates current slice which is shown in viewer

};
