#pragma once

#include "itkImageFileWriter.h"
#include <itkImage.h>
#include "itkVersorRigid3DTransform.h"
#include "itkBSplineDeformableTransform.h"
#include "itkAffineTransform.h"
#include "itkTranslationTransform.h"
#include "itkResampleImageFilter.h"
#include <itkMultiResolutionPyramidImageFilter.h>
#include <itkNearestNeighborExtrapolateImageFunction.h>
#include <itkRigid2DTransform.h>
#include <itkImageMaskSpatialObject.h>
#include <itkHistogramMatchingImageFilter.h>
//#include <itkPNGImageIO.h>
#include <itkImageBase.h>
#include "itkAndImageFilter.h"
#include "itkLabelStatisticsImageFilter.h"
#include "itkBinaryImageToLabelMapFilter.h"
#include "itkLabelMapToLabelImageFilter.h"
#include "itkORImageFilter.h"

#include "itkGDCMImageIO.h"
#include "itkGDCMSeriesFileNames.h"
#include "itkImageSeriesReader.h"

#if ITK_VERSION_MAJOR > 3
#include "itkBSplineTransform.h"
#endif
#include "itkLBFGSOptimizer.h"
#include "itkFlipImageFilter.h"
#include <itkSimilarity3DTransform.h>
#include"itkImageRegistrationMethod.h"
#include"itkMattesMutualInformationImageToImageMetric.h"
#include <itkNormalizedCorrelationImageToImageMetric.h>
#include <itkNormalizedMutualInformationHistogramImageToImageMetric.h>
#include <itkANTSNeighborhoodCorrelationImageToImageMetricv4.h>
#include "itkGradientDifferenceImageToImageMetric.h"
#include "itkMeanSquaresHistogramImageToImageMetric.h"
#include "itkLinearInterpolateImageFunction.h"
#include "itkRegularStepGradientDescentOptimizer.h"
#include "itkBSplineResampleImageFunction.h"
#include "itkTranslationTransform.h"
#include "itkMeanSquaresImageToImageMetric.h"
#include "itkVersorRigid3DTransformOptimizer.h"
#include "itkCenteredTransformInitializer.h"
#include "itkExceptionObject.h"
#include "itkImageFileWriter.h"
#include "itkTransformFileReader.h"
#include "itkTransformFileWriter.h"
#include "itkTransformFactoryBase.h"
#include "itkEuler3DTransform.h"
#include "itkChangeInformationImageFilter.h"
#include "itkRescaleIntensityImageFilter.h"
//#include "itkVersorTransform.h"
#include "itkLBFGSBOptimizer.h"
#include "itkScaleSkewVersor3DTransform.h"
#include "itkCompositeTransform.h"
#include "itkMutualInformationImageToImageMetric.h"
#include "itkThresholdImageFilter.h"
#include "itkGradientMagnitudeImageFilter.h"
#include "itkBinaryErodeImageFilter.h"
#include "itkBinaryBallStructuringElement.h"
#include "itkOrImageFilter.h"
#include "itkAndImageFilter.h"
#include "itkBinaryThresholdImageFilter.h"
#include "itkBinaryDilateImageFilter.h"
#include "itkCommand.h"
#include "itkMultiResolutionImageRegistrationMethod.h"
#include "itkRecursiveMultiResolutionPyramidImageFilter.h"
#include "itkTimeProbe.h"
#include "itkRegionOfInterestImageFilter.h"
#include "itkBinaryMorphologicalOpeningImageFilter.h"
#include "itkBinaryMorphologicalClosingImageFilter.h"
#include "itkZeroCrossingBasedEdgeDetectionImageFilter.h"
#include <itkVTKImageToImageFilter.h>
#include "itkConnectedComponentImageFilter.h"
#include "itkLabelShapeKeepNObjectsImageFilter.h"

#include "itkImageToVTKImageFilter.h"
#include <itkExtractImageFilter.h>
#include <itkSubtractImageFilter.h>

#include <vtkCylinderSource.h>
#include <vtkCleanPolyData.h>
#include <vtkAppendPolyData.h>
#include <vtkImageDataGeometryFilter.h>
#include "vtkDataSetSurfaceFilter.h" 
#include <vtkTriangleFilter.h>
#include <vtkSTLWriter.h>
#include <vtkXMLPolyDataWriter.h>
#include <vtkSurfaceReconstructionFilter.h>
#include <vtkProgrammableSource.h>
#include <vtkContourFilter.h>
#include <vtkReverseSense.h>
#include <vtkDiscreteMarchingCubes.h>
#include <vtkSmoothPolyDataFilter.h>
#include <vtkQuadricDecimation.h>
#include <vtkPolyDataNormals.h>
#include <vtkFloatArray.h>
#include <vtkPointData.h>
#include <vtkGeometryFilter.h>
#include <vtkTransform.h>
#include <vtkTransformPolyDataFilter.h>
#include <vtkMatrix4x4.h>
#include <vtkPolyDataToImageStencil.h>
#include <vtkMetaImageWriter.h>
#include <vtkImageStencil.h>

using namespace std;

// type defs for different types of images and transforms that will be used in this file

typedef itk::Image<INT16, 3> ImageTypeInt16;
typedef itk::Image<unsigned char, 3> ImageTypeU3;
typedef itk::Image<unsigned char, 2> ImageTypeU2;
typedef itk::Image<float, 3> ImageTypeF3;
typedef itk::Image<float, 2> ImageTypeF2;
typedef itk::Image<unsigned char, 2> ImageTypeI2;
typedef itk::Image<int16_t, 3> ImageTypeI16_3;
typedef itk::VersorRigid3DTransform< double > RigidTransformType;
typedef itk::Rigid3DTransform< double > Rigid3DTransformType;
typedef itk::TranslationTransform< double, 3 > TranslationalTransformType;
typedef itk::Similarity3DTransform< double > Similarity3DTransformType;
typedef itk::BSplineDeformableTransform<double, 3, 3> DeformableTransformType;
typedef itk::BSplineDeformableTransform<double, 2, 3> DeformableTransformType2D;
typedef itk::CompositeTransform< double, 3 >  CompositeTransformType;
typedef itk::BSplineTransform< double, 3, 3> BSplineTransformType;
typedef itk::AffineTransform< double, 3 > AffineTransformType;
typedef itk::AffineTransform< double, 2 > AffineTransformType2D;
typedef itk::Rigid2DTransform<double> Rigid2DTransformType;
typedef itk::ImageMaskSpatialObject<2> ImageMaskSpatialObject;
typedef ImageMaskSpatialObject::ImageType     MaskImageType;
typedef itk::ImageMaskSpatialObject<3> ImageMaskSpatialObject3D;
typedef ImageMaskSpatialObject3D::ImageType     MaskImageType3D;
typedef itk::Vector< float, 2 >      VectorType;
typedef itk::Image< VectorType, 2 >  DeformationFieldType;
typedef itk::RGBPixel< unsigned char >          RGBPixelType;
typedef itk::Image< RGBPixelType, 3 > RGBImageType3D;
typedef itk::Image< RGBPixelType, 2 > RGBImageType2D;

// A template function to save image on hardisk. User supplies the image pointer and file name
template <class TInputImage>
void saveImage(typename TInputImage::Pointer input, std::string name) {
	typename itk::ImageFileWriter<TInputImage>::Pointer w;
	w = itk::ImageFileWriter<TInputImage>::New();
	w->SetFileName(name.c_str());
	w->SetInput(input);
	w->Update();
}

// A template function to read image from hardisk. User supplie the file name
template<class ImageType>
typename ImageType::Pointer readImage(std::string fileName)
{
	typename itk::ImageFileReader< ImageType >::Pointer r = itk::ImageFileReader< ImageType >::New();
	r->SetFileName(fileName);
	try
	{
		r->Update();
	}
	catch (itk::ExceptionObject & excp)
	{
		std::cerr << "Problem reading the input file " << fileName << std::endl;
		std::cerr << excp << std::endl;
		return NULL;
	}

	return r->GetOutput();
}

vtkSmartPointer<vtkPolyData> laplacianSmooth(vtkSmartPointer<vtkPolyData>, float relaxationFactor = 0.04, int iterations = 80, float convergence = 0);

// A function to estimate translation in 3D using manual step wise walk
TranslationalTransformType::Pointer estimateTranslation(ImageTypeU3::Pointer fixedImage, ImageTypeU3::Pointer movingImage);

// A function for deformable image matching using cubic B splines
DeformableTransformType::Pointer deformableRegistration(
	ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer tempImage,
	float & optimalMetricValue,
	CompositeTransformType::Pointer initialTransform, // transform used to initialize te b spline function
	float numberOfSamplesBSCoarse = 30.0,	// factor specifying the number of samples to be used during optimization.
	int numberOfIterationsBSCoarse = 300,  // iterations of optimixer
	float bsCoarseMaxStepLength = 4,      // max step of the optimizer
	float bsCoarseMinStepLength = 0.1,   // min step of the optimizer
	float bsCoarseRelaxationFactor = 0.9, // relaxation factor of the optimixer
	int numberOfGridNodesInOneDimCoarse = 10 // number of nodes per axis in the b spline function
);

// A function for finding optimal rigid transform between two images
RigidTransformType::Pointer rigidRegistration(
	ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer movingImage,
	float & optimalMetricValue,
	RigidTransformType::Pointer initialTransform,
	int numberOfSamplesRigid = 200000L,
	int numberOfIterationsRigid = 750,
	float rigidMaxStepLength = 0.1,
	float rigidMinStepLength = 0.005
);

// computes the similarity between two images using a transform and a mask
float computeSimilarity(ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer movingImage,
	CompositeTransformType::Pointer compositeTransform,
	ImageTypeU3::Pointer movingMask
);


// A function for finding optimal affine transform between two images
AffineTransformType::Pointer affineRegistration(
	ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer movingImage,
	float & optimalMetricValue,
	AffineTransformType::Pointer initialTransform,
	int numberOfSamplesAffine = 200000L,
	int numberOfIterationsAffine = 1000,
	float affineMaxStepLength = 0.1,
	float affineMinStepLength = 0.005
);

// flips an affine transform around a specified point along specific axes
AffineTransformType::Pointer flipTransform(
	AffineTransformType::Pointer transform,
	ImageTypeU3::PointType centerOfRotation,
	bool flipX,
	bool flipY,
	bool flipZ);

// Crops an image using a mask
ImageTypeU3::Pointer cropImage(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask);

// main function for finding composite transform between two images
CompositeTransformType::Pointer findOptimalCompositeTranform(
	ImageTypeU3::Pointer fixedImage,    // target image is used as fixed image
	ImageTypeU3::Pointer fixedImageSmooth,  // a smooth version of target image
	ImageTypeU3::Pointer movingImage,	// reference image is used as moving image
	ImageTypeU3::Pointer movingSegmentationContours,
	ImageTypeU3::Pointer movingMask, // a mask to be used a region with which the moving is to be cropped
	bool useMask,	// whether to crop the moving image or not
	float & optimalMetric,	// this function also sets the metric corresponding to the output transform
	bool isSimple		// whether to run in simple or complex mode
);


vtkSmartPointer<vtkPolyData> transformSurface(vtkSmartPointer<vtkPolyData> inputSurface, vtkSmartPointer<vtkTransform> transform);

vtkSmartPointer<vtkPolyData>  createCylinder(float XCenter, float YCenter, float ZCenter, float cylinderRadius, float cylinderHeight);

vtkSmartPointer<vtkPolyData> getSurface(ImageTypeU3::Pointer input, ImageTypeU3::Pointer targetImage, DeformableTransformType::Pointer bsplineTx);

ImageTypeU3::Pointer transformImage(ImageTypeU3::Pointer input, ImageTypeU3::Pointer targetImage, DeformableTransformType::Pointer bsplineTx, ImageTypeU3::Pointer andMask);

vtkSmartPointer<vtkPolyData> createSurface(ImageTypeU3::Pointer input);

// This function is called by QTWidget class... returns an stl model of the target surface
vector<vtkSmartPointer<vtkPolyData>>  findSurfaceOnTarget(
	ImageTypeU3::Pointer targetImage,
	ImageTypeU3::Pointer referenceImage,
	MaskImageType3D::Pointer referenceSegmentationROI,
	MaskImageType3D::Pointer referenceSegmentationContours,
//	MaskImageType3D::Pointer refMask,
	MaskImageType3D::Pointer refCylinders,
	MaskImageType3D::Pointer refCylindersBoundaries,
//	MaskImageType3D::Pointer refEntranceMask,
//	MaskImageType3D::Pointer refNasopharynxMask,
	bool isSimple,		// whether to use simple or complex mode
	bool isCT,
	float & metricValue,
	vector<ImageTypeU3::PointType>  & centers // metricValue is returned based upon which warning is displayed, if convergence is not acheived
);

vector <ImageTypeU3::PointType> getCylinderCenters(MaskImageType3D::Pointer image);

ImageTypeU3::PointType getPhysicalCenterOfBinaryImage(ImageTypeU3::Pointer image);

ImageTypeU3::Pointer thresholdImageWithMaskCT(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask);

ImageTypeU3::Pointer thresholdImageWithMaskMRI(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask);

ImageTypeU3::Pointer getLargestConnectedRegion(ImageTypeU3::Pointer nasopharynxImage, int numberComponents);

int getMeanFromImageandMask(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask, float &variance);

ImageTypeU3::Pointer getImageFromPolyData(vtkSmartPointer<vtkPolyData> inputSurface, ImageTypeU3::Pointer referenceImage, bool takeUnion);
