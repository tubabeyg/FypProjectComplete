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
#include <QComboBox>
#include <QFileDialog>
#include <QMessageBox>
#include <QDirIterator>
#include <QDesktopWidget>

#include "itkGDCMImageIO.h"
#include "itkGDCMSeriesFileNames.h"
#include "itkImageSeriesReader.h"
#include "itkTileImageFilter.h"
#include "itkChangeInformationImageFilter.h"
#include "itkNormalizeImageFilter.h"
#include "itkTextOutput.h"
#include "itkBinaryContourImageFilter.h"

#include <vtkCylinderSource.h>
#include <vtkPolyData.h>
#include <vtkSTLReader.h>
#include <vtkSTLWriter.h>
#include <vtkSmartPointer.h>
#include <vtkPolyDataMapper.h>
#include <vtkActor.h>
#include <vtkRenderWindow.h>
#include <vtkRenderer.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkPolyDataConnectivityFilter.h>

#include "imageWidget.h"
#include "renderWidget.h"
#include "registration.h"

#include <thread>

typedef itk::Image<float, 3> ImageTypeF3;

class QTWidget : public QMainWindow {

	Q_OBJECT

public:

	//default constructor
	QTWidget(QString targetFolderName = "", QString referenceFolderName = "", QString saveFileName = "", QString ModalityName = "", QString simple = "");
	~QTWidget();

private:
	vector<ImageTypeU3::PointType> cylinderCenters;
	vector<bool> areImagesCT;
	QString targetFileName, Modality;
	bool referenceLoaded, targetLoaded;
	std::thread *registrationThread; // thread to run the image registration
	QMessageBox* msgBox; // A message box to show progress
	imageWidget* targetImViewer, *refImViewer; // image viewers for target and reference scans
	renderWidget * refRenderWidget, *targetRenderWidget;  // render widgets for target and reference stl models
	QToolBar *ImageToolBar; // toolbar providing main menu functions
	QPushButton * loadButton, *loadFileButton;// , *loadVolButton;
	QRadioButton *simpleButton, *CTButton, *MRIButton;		// radio button for choosing algorithm complexity
															//QCheckBox * useMaskCheckBox; // check box for using region of interest in reference
	QComboBox* dropdownMenu;		// dropdown menu for choosing a particular image series
	std::vector<ImageTypeU3::Pointer> targetImages;  // contains all target images/series within a folder
	ImageTypeU3::Pointer refImage;  // reference image
	MaskImageType3D::Pointer refSegmentationROI, refSegmentationContours, refMask, refNoseEntranceMask, refNasopharynxMask, refCylinders, refCylindersBoundaries; // reference segmentation and mask identifying region of interest
	vector<vtkSmartPointer<vtkPolyData>>  targetSurfaces; // target stl model: goal of the algorithm is to find this data

	ImageTypeU3::Pointer convert3DFloatToUnsignedChar(ImageTypeF3::Pointer floatImg); // converts floating point image into unsigned char format
	void registrationFunction();
	void selectLargestConnectedComponent(vtkSmartPointer<vtkPolyData> &polyData);
	bool loadReference(QString imageFileName);
	void loadDicomFolder(QString);		// function for loading a target dicom folder
	void loadVolFolder(QString dirName);   // function for opening target  images of *.vol type
	void loadTargetFolder(QString dirName);
	void loadReferenceFolder(QString dirName);
	void saveTargetSurface(QString fileName);
	void createReferenceCylinders();
	ImageTypeU3::Pointer resampleImage(ImageTypeU3::Pointer image, bool isBinary);

	protected slots:
	void loadTargetFolder();
	void loadFile();		// function for opening target images in other formats
	void loadReferenceFolder(); // function for opening reference image and stl model
	void generateTargetSurface();  // main function for calculating the stl target model
	void saveTargetSurface();      // saves the precomputed target stl model in hardisk
	void loadTargetSurface();      // loads the precomputed target stl model from hardisk
	void selectImage(int);         // selects a particular series from preloaded study 
	void showTargetModel();

signals:
	void registrationCompleted();
};
