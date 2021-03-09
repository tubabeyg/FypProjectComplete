#include "registration.h"

using namespace std;

//vtkSmartPointer<vtkPolyData> decimation(vtkSmartPointer<vtkPolyData> polyData, float reductionFactor)
//{
//	vtkSmartPointer<vtkQuadricDecimation> decimate = vtkSmartPointer<vtkQuadricDecimation>::New();
//	decimate->SetInputData(polyData);
//	decimate->SetTargetReduction(reductionFactor);
//	decimate->Update();
//
//	vtkSmartPointer<vtkPolyData> outPolyData = decimate->GetOutput();
//	return outPolyData;
//}


vtkSmartPointer<vtkPolyData> laplacianSmooth(vtkSmartPointer<vtkPolyData> polyData, float relaxationFactor, int iterations, float convergence)
{
	vtkSmartPointer<vtkSmoothPolyDataFilter> smoother = vtkSmartPointer<vtkSmoothPolyDataFilter>::New();
	smoother->SetInputData(polyData);
	smoother->SetRelaxationFactor(relaxationFactor);
	smoother->SetFeatureAngle(190);
	smoother->SetConvergence(convergence);
	smoother->SetNumberOfIterations(iterations);
	smoother->FeatureEdgeSmoothingOff();
	//smoother->SetEdgeAngle(120);
	smoother->BoundarySmoothingOn();
	smoother->Update();
	vtkSmartPointer<vtkPolyData> outPolyData = smoother->GetOutput();
	return outPolyData;
}

AffineTransformType::Pointer flipTransform(AffineTransformType::Pointer transform, ImageTypeU3::PointType centerOfRotation, bool flipX, bool flipY, bool flipZ)
{
	// This function flips a given affine transform around a given physicla center of rotation and given axes

	int xflip = 1, yflip = 1, zflip = 1;
	if (flipX == true)
		xflip = -1;
	if (flipY == true)
		yflip = -1;
	if (flipZ == true)
		zflip = -1;

	// Define a new transform with the specified center of rotation. The translation is the same as the original affine transform.
	// The rotation matrix will be flipped at the given axis.
	AffineTransformType::Pointer outTransform = AffineTransformType::New();
	outTransform->SetIdentity();
	outTransform->SetCenter(centerOfRotation);
	outTransform->SetTranslation(transform->GetTranslation());

	// flip the rotation matrix
	AffineTransformType::MatrixType mat;
	mat[0][0] = transform->GetMatrix()[0][0] * xflip;	mat[0][1] = transform->GetMatrix()[0][1];			mat[0][2] = transform->GetMatrix()[0][2];
	mat[1][0] = transform->GetMatrix()[1][0];			mat[1][1] = transform->GetMatrix()[1][1] * yflip;	mat[1][2] = transform->GetMatrix()[1][2];
	mat[2][0] = transform->GetMatrix()[2][0];			mat[2][1] = transform->GetMatrix()[2][1];			mat[2][2] = transform->GetMatrix()[2][2] * zflip;
	outTransform->SetMatrix(mat);

	return outTransform;
}

//
//ImageTypeU3::Pointer computeMaskFromSegmentation(ImageTypeU3::Pointer segmentation)
//{
//	// This function takes a segmentation map and creates a new mask around the boundaries of the segmentation map. Instead of looking
//	// at all the pixels within the segmentation map, we are interested only in those pixels that contribute to boundaries of the contour
//
//	// First rescale to image intensities from 0-1 to 0-255
//	typedef itk::RescaleIntensityImageFilter< ImageTypeU3, ImageTypeU3 >	RescaleType;
//	RescaleType::Pointer rescale = RescaleType::New();
//	rescale->SetInput(segmentation);
//	rescale->SetOutputMinimum(0);
//	rescale->SetOutputMaximum(itk::NumericTraits< ImageTypeU3::PixelType >::max());
//	rescale->Update();
//
//	// Get the contours from the binary map
//	typedef itk::Image< unsigned char, 3 > AccumulatorImageType;
//	typedef itk::CastImageFilter< ImageTypeU3, AccumulatorImageType >	CastingFilterType;
//	CastingFilterType::Pointer caster = CastingFilterType::New();
//	//std::cout << "Applying gradient magnitude filter" << std::endl;
//	typedef itk::GradientMagnitudeImageFilter<AccumulatorImageType, AccumulatorImageType > GradientFilterType;
//	GradientFilterType::Pointer gradFilter = GradientFilterType::New();
//	caster->SetInput(rescale->GetOutput());
//	gradFilter->SetInput(caster->GetOutput());
//	gradFilter->Update();
//	ImageTypeU3::Pointer gradientMask = gradFilter->GetOutput();
//	//saveImage<ImageTypeU3>(gradientMask, "MaskGradient.mhd");
//
//	// smooth the contours.....
//	typedef itk::DiscreteGaussianImageFilter<ImageTypeU3, ImageTypeU3 > GaussianFilterType;
//	GaussianFilterType::Pointer smoother = GaussianFilterType::New();
//	smoother->SetInput(gradientMask);
//	const double sigmaX = 2.0;
//	smoother->SetVariance(sigmaX);
//	smoother->Update();
//	ImageTypeU3::Pointer maskSmooth = smoother->GetOutput();
//
//	// Threshold the contours. The aim is to expand the contours....
//	typedef itk::ThresholdImageFilter<AccumulatorImageType> ThresholdFilterType;
//	ThresholdFilterType::Pointer threshFilter = ThresholdFilterType::New();
//	threshFilter->SetInput(maskSmooth);
//	threshFilter->SetOutsideValue(itk::NumericTraits< ImageTypeU3::PixelType >::max());
//	threshFilter->ThresholdAbove(0);
//	threshFilter->Update();
//
//	//saveImage<ImageTypeU3>(threshFilter->GetOutput(), "MaskGradient2.mhd");
//
//	return threshFilter->GetOutput();
//}
//
//ImageTypeU3::Pointer computeMaskFromSegmentationForThresholding(ImageTypeU3::Pointer segmentation)
//{
//	// This function takes a segmentation map and creates a new mask around the boundaries of the segmentation map. Instead of looking
//	// at all the pixels within the segmentation map, we are interested only in those pixels that contribute to boundaries of the contour
//
//	// First rescale to image intensities from 0-1 to 0-255
//	typedef itk::RescaleIntensityImageFilter< ImageTypeU3, ImageTypeU3 >	RescaleType;
//	RescaleType::Pointer rescale = RescaleType::New();
//	rescale->SetInput(segmentation);
//	rescale->SetOutputMinimum(0);
//	rescale->SetOutputMaximum(itk::NumericTraits< ImageTypeU3::PixelType >::max());
//	rescale->Update();
//
//	typedef itk::BinaryBallStructuringElement<ImageTypeU3::PixelType, 3>  StructuringElementType;
//	StructuringElementType structuringElement;
//	structuringElement.SetRadius(6);
//	structuringElement.CreateStructuringElement();
//	typedef itk::BinaryDilateImageFilter <ImageTypeU3, ImageTypeU3, StructuringElementType>	BinaryDilateImageFilterType;
//	BinaryDilateImageFilterType::Pointer dilateFilter = BinaryDilateImageFilterType::New();
//	dilateFilter->SetInput(rescale->GetOutput());
//	dilateFilter->SetKernel(structuringElement);
//	dilateFilter->Update();
//
//	StructuringElementType structuringElement2;
//	structuringElement2.SetRadius(8);
//	structuringElement2.CreateStructuringElement();
//	typedef itk::BinaryMorphologicalClosingImageFilter <ImageTypeU3, ImageTypeU3, StructuringElementType>	BinaryMorphologicalClosingImageFilterType;
//	BinaryMorphologicalClosingImageFilterType::Pointer closingFilter = BinaryMorphologicalClosingImageFilterType::New();
//	closingFilter->SetInput(dilateFilter->GetOutput());
//	closingFilter->SetKernel(structuringElement2);
//	closingFilter->Update();
//
//	//saveImage<ImageTypeU3>(erodeFilter->GetOutput(), "MaskGradient.mhd");
//
//	return closingFilter->GetOutput();
//}
//

float computeSimilarity(ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer movingImage,
	CompositeTransformType::Pointer compositeTransform,
	ImageTypeU3::Pointer movingMask
)
{
	// This function computes the similarity between two images. It first transforms the moving image using the specifies transform. Then
	// evaluation is done on selected pixels using a mask.

	// First trasform the moving image according to the transform
	typedef itk::ResampleImageFilter<ImageTypeU3, ImageTypeU3 >  resampleFilterType;
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double >  InterpolatorType;
	resampleFilterType::Pointer filter = resampleFilterType::New();
	InterpolatorType::Pointer interpolator = InterpolatorType::New();
	filter->SetInterpolator(interpolator);
	filter->SetOutputOrigin(movingImage->GetOrigin());
	filter->SetOutputSpacing(movingImage->GetSpacing());
	filter->SetOutputDirection(movingImage->GetDirection());
	filter->SetSize(movingImage->GetLargestPossibleRegion().GetSize());
	filter->SetInput(fixedImage);
	filter->SetTransform(compositeTransform->GetInverseTransform());
	filter->Update();
	ImageTypeU3::Pointer fixedTransformed = filter->GetOutput();


	// Now find the similariy between the two images. Since both images lie in the same physical space, we intriduce a dummy translation
	// transform and set it to identiy. Mutual information is used as similarity metric.
	TranslationalTransformType::ParametersType parameters;
	parameters.SetSize(3);
	parameters.fill(0);
	TranslationalTransformType::Pointer identityTransform = TranslationalTransformType::New();
	identityTransform->SetIdentity();
	typedef itk::MattesMutualInformationImageToImageMetric<ImageTypeU3, ImageTypeU3> MetricType;
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double >  InterpolatorType;
	InterpolatorType::Pointer interpolator2 = InterpolatorType::New();
	MetricType::Pointer         metric = MetricType::New();
	metric->UseAllPixelsOn();
	metric->SetNumberOfHistogramBins(30);
	metric->SetFixedImage(fixedTransformed);
	metric->SetMovingImage(movingImage);
	ImageMaskSpatialObject3D::Pointer spatialMask = ImageMaskSpatialObject3D::New();
	spatialMask->SetImage(movingMask);
	metric->SetMovingImageMask(spatialMask);
	metric->SetFixedImageMask(spatialMask);
	metric->SetInterpolator(interpolator2);
	metric->SetFixedImageRegion(fixedTransformed->GetLargestPossibleRegion());
	metric->SetTransform(identityTransform);
	float val;
	try {
		metric->Initialize();
		val = metric->GetValue(parameters);
	}
	catch (itk::ExceptionObject & err)
	{

		//saveImage<ImageTypeU3>(fixedTransformed, "fixedTransformed.mhd");
		//saveImage<ImageTypeU3>(movingImage, "movingImage.mhd");
		//saveImage<ImageTypeU3>(movingMask, "movingMask.mhd");

		std::cerr << "ExceptionObject caught while calculating similarity " << std::endl;
		std::cerr << err << std::endl;
		return VTK_FLOAT_MAX;
	}
	return val;
}


ImageTypeU3::Pointer cropImage(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask)
{
	// This function crops an image using the region of the mask

	ImageTypeU3::IndexType desiredStart;
	image->TransformPhysicalPointToIndex(mask->GetOrigin(), desiredStart);
	ImageTypeU3::SizeType desiredSize = mask->GetBufferedRegion().GetSize();
	ImageTypeU3::RegionType desiredRegion(desiredStart, desiredSize);
	typedef itk::RegionOfInterestImageFilter< ImageTypeU3, ImageTypeU3 > FilterType;
	FilterType::Pointer filter = FilterType::New();
	filter->SetRegionOfInterest(desiredRegion);
	filter->SetInput(image);
	filter->Update();
	return filter->GetOutput();
	//saveImage<ImageTypeU3>(filter->GetOutput(), "cropped.mhd");
}

CompositeTransformType::Pointer findOptimalCompositeTranform(
	ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer fixedImageSmooth,
	ImageTypeU3::Pointer movingImage,
	ImageTypeU3::Pointer movingSegmentationContours,
//	ImageTypeU3::Pointer movingMask,
	bool useMask,
	float & optimalMetric,
	bool isSimple
)
{
	// This function finds an optimal transform between fixed and moving image. Moving segmentation is used to evaluate similarity on the boundaries 
	// Moving mask is used to crop the moving image only if useMask flag is on. The function returns the optimal composite transform which is a 
	// combination of rigid and affine transform, which, when applied to the moving image produces a good overlap with the fixed image. The
	// optimalMetric corresponds to the metric value of that transformation. 


	// Crop moving image and moving segmentation if use mask flag is on
	ImageTypeU3::Pointer croppedMovingImage, croppedMovingSegmentation;
//	if (useMask)
//	{
//		croppedMovingImage = cropImage(movingImage, movingMask);
		// THe cropping is done on the mask which consists of the neighborhood of the contours of the segmentation map
//		croppedMovingSegmentation = cropImage(movingSegmentationContours, movingMask);
//	}
//	else
//	{
		croppedMovingImage = movingImage;
		croppedMovingSegmentation = movingSegmentationContours;
//	}
//
	// Iniitialize the rigid transform between cropped moving and reference image. This align the physical center of two images.
	typedef itk::CenteredTransformInitializer<RigidTransformType, ImageTypeU3, ImageTypeU3> TransformInitializerType;
	TransformInitializerType::Pointer initializer = TransformInitializerType::New();
	RigidTransformType::Pointer  initialTransform = RigidTransformType::New();
	initializer->SetTransform(initialTransform);
	initializer->SetFixedImage(fixedImage);
	initializer->SetMovingImage(croppedMovingImage);
	initializer->GeometryOn();
	//initializer->MomentsOn();
	initializer->InitializeTransform();

	// fixed image is already smoothed. Now we smooth our moving image
	typedef itk::DiscreteGaussianImageFilter<ImageTypeU3, ImageTypeU3 > GaussianFilterType;
	GaussianFilterType::Pointer smoother2 = GaussianFilterType::New();
	smoother2->SetInput(croppedMovingImage);
	smoother2->SetVariance(4.0);
	smoother2->Update();
	ImageTypeU3::Pointer movingImageSmooth = smoother2->GetOutput();

	// Initialize an affine transform with the same paramters as the one with the initialized rigid transform.
	AffineTransformType::Pointer initTx = AffineTransformType::New();
	initTx->SetCenter(initialTransform->GetCenter());
	initTx->SetTranslation(initialTransform->GetTranslation());
	initTx->SetMatrix(initialTransform->GetMatrix());

	// There are two modes. Simple and Complex: In complex mode we run optimization four times, onw without flipping any axis of the moving image.
	// and three times by flipping each axis of the moving image. In simple mode we dont flip any axis.

	vector<vector<bool>> flipAxes;
	if (isSimple)
		flipAxes.push_back({ false, false, false });
	else
	{
		flipAxes.push_back({ false, false, false });
		flipAxes.push_back({ false, false, true });
		flipAxes.push_back({ false, true, false });
		flipAxes.push_back({ true, false, false });
	}

	// Now create seperate transforms for each flipped operation.
	vector<AffineTransformType::Pointer> transforms(flipAxes.size());
	for (int i = 0; i < flipAxes.size(); i++)
	{
		// The flipping is done on the physical center point. This can be found by finding the image center pixel location and then finding
		// the physical location corresponding to the center pixel location
		ImageTypeU3::SizeType size2 = croppedMovingImage->GetLargestPossibleRegion().GetSize();
		ImageTypeU3::IndexType index2;
		ImageTypeU3::PointType phyCenter2, txCenter;
		index2[0] = size2[0] / 2;
		index2[1] = size2[1] / 2;
		index2[2] = size2[2] / 2;
		croppedMovingImage->TransformIndexToPhysicalPoint(index2, phyCenter2);
		txCenter = initTx->GetInverseTransform()->TransformPoint(phyCenter2);
		AffineTransformType::Pointer flippedTransform = flipTransform(initTx, txCenter, flipAxes[i][0], flipAxes[i][1], flipAxes[i][2]);
		transforms[i] = flippedTransform;
		//saveImage<ImageTypeU3>(filter->GetOutput(), "flipped"+ to_string(i) + ".mhd");
	}

	AffineTransformType::Pointer optimalAffineTransform;
	optimalMetric = VTK_FLOAT_MAX;
	cout << "registration " << endl;
	typedef itk::ResampleImageFilter<ImageTypeU3, ImageTypeU3 >  resampleFilterType;
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double >  InterpolatorType;
	int bestIndex;

	// We optimize each flipped transform and the nselect the one transform of the four in complex mode that results in best image similarity
	for (int i = 0; i < transforms.size(); i++)
	{
		cout << "iteration   " << i << endl << endl << endl;
		float rigidMetricValue = VTK_FLOAT_MAX, affineMetricValue1 = VTK_FLOAT_MAX, affineMetricValue2 = VTK_FLOAT_MAX;

		// First flip the moving image smooth according to the transform
		itk::FixedArray<bool, 3> flipAxesNew;
		flipAxesNew[0] = flipAxes[i][0];
		flipAxesNew[1] = flipAxes[i][1];
		flipAxesNew[2] = flipAxes[i][2];
		typedef itk::FlipImageFilter <ImageTypeU3>	FlipImageFilterType;
		FlipImageFilterType::Pointer flipFilter = FlipImageFilterType::New();
		flipFilter->SetInput(movingImageSmooth);
		flipFilter->SetFlipAxes(flipAxesNew);
		flipFilter->Update();
		typedef itk::ChangeInformationImageFilter< ImageTypeU3 > FilterType;
		FilterType::Pointer changeFilter = FilterType::New();
		changeFilter->SetInput(flipFilter->GetOutput());
		changeFilter->SetChangeOrigin(true);
		changeFilter->SetOutputOrigin(movingImageSmooth->GetOrigin() - initialTransform->GetTranslation());
		changeFilter->Update();
		ImageTypeU3::Pointer newMovingImage = changeFilter->GetOutput();

		// Now use the new moving image and fixed image smooth for optimization
		AffineTransformType::Pointer optimalAffineTransform1, optimalAffineTransform2;
		if (!isSimple)
		{
			// In complex mode, we first find translation, then use it to initialize the rigid transform, optimize the rigid transform
			// then use the optimal rigid transform to initialize the affine transform and finally optimize the affine transform.

			// Find translation
			TranslationalTransformType::Pointer currentOptimalTranslationalTransform = estimateTranslation(fixedImageSmooth, newMovingImage);
			currentOptimalTranslationalTransform.Print(cout);
			RigidTransformType::Pointer initialRigidTransform = RigidTransformType::New();
			initialRigidTransform->SetCenter(transforms[i]->GetCenter());
			// Initilize rigid transform with the translation
			initialRigidTransform->SetTranslation(currentOptimalTranslationalTransform->GetOffset());

			// Optimize the rigid transform
			RigidTransformType::Pointer currentOptimalRigidTransform = rigidRegistration(fixedImageSmooth, newMovingImage, rigidMetricValue, initialRigidTransform);

			// Initialize the affine transform using the optimal rigid transform
			AffineTransformType::Pointer currentAffineTransform = AffineTransformType::New();
			currentAffineTransform->SetCenter(currentOptimalRigidTransform->GetCenter());
			currentAffineTransform->SetTranslation(currentOptimalRigidTransform->GetTranslation());
			currentAffineTransform->SetMatrix(currentOptimalRigidTransform->GetMatrix());
			// Optimize affine transform
			optimalAffineTransform1 = affineRegistration(fixedImageSmooth, newMovingImage, affineMetricValue1, currentAffineTransform);

			// Create the compiste transform (flipped + optimal affine)
			CompositeTransformType::Pointer  compositeTransform = CompositeTransformType::New();
			compositeTransform->AddTransform(transforms[i]);
			compositeTransform->AddTransform(optimalAffineTransform1);

			// Instead of using affineMetricValue1, find similarity alongside contours 
			affineMetricValue1 = computeSimilarity(fixedImage, croppedMovingImage, compositeTransform, croppedMovingSegmentation);
		}
		{
			// In both simple and complex modes, we skip the translation step and see if skipping the translation imprvoes the local minima

			// Initialize the rigid transform, optimize it, initialize the affine transform with the optimal rigid one, and then further optimize
			// the affine one.
			RigidTransformType::Pointer initialRigidTransform = RigidTransformType::New();
			initialRigidTransform->SetCenter(transforms[i]->GetCenter());
			RigidTransformType::Pointer currentOptimalRigidTransform = rigidRegistration(fixedImageSmooth, newMovingImage, rigidMetricValue, initialRigidTransform);
			AffineTransformType::Pointer currentAffineTransform = AffineTransformType::New();
			currentAffineTransform->SetCenter(currentOptimalRigidTransform->GetCenter());
			currentAffineTransform->SetTranslation(currentOptimalRigidTransform->GetTranslation());
			currentAffineTransform->SetMatrix(currentOptimalRigidTransform->GetMatrix());
			optimalAffineTransform2 = affineRegistration(fixedImageSmooth, newMovingImage, affineMetricValue2, currentAffineTransform);

			// Create the compiste transform (flipped + optimal affine)
			CompositeTransformType::Pointer  compositeTransform = CompositeTransformType::New();
			compositeTransform->AddTransform(transforms[i]);
			compositeTransform->AddTransform(optimalAffineTransform2);

			// Instead of using affineMetricValue2, find similarity alongside contours 
			affineMetricValue2 = computeSimilarity(fixedImage, croppedMovingImage, compositeTransform, croppedMovingSegmentation);
		}

		// Compare (translation + rigid + affine) with (rigid + affine) and select the one transform which has the best metric
		if (affineMetricValue2 <= affineMetricValue1)
		{
			if (affineMetricValue2 <= optimalMetric)
			{
				optimalMetric = affineMetricValue2;
				optimalAffineTransform = optimalAffineTransform2;
				bestIndex = i;
			}
		}
		else
		{
			if (affineMetricValue1 <= optimalMetric)
			{
				optimalMetric = affineMetricValue1;
				optimalAffineTransform = optimalAffineTransform1;
				bestIndex = i;
			}
		}
		cout << "best index " << bestIndex << endl;
		cout << "optimalMetric " << optimalMetric << endl;
	}

	// The final composite transform is the concatenation of best flipping axes and the optimal transform
	CompositeTransformType::Pointer  compositeTransform = CompositeTransformType::New();
	compositeTransform->AddTransform(transforms[bestIndex]);
	compositeTransform->AddTransform(optimalAffineTransform);
	cout << "after affine metric value " << optimalMetric << endl;
	return compositeTransform;

}

TranslationalTransformType::Pointer estimateTranslation(ImageTypeU3::Pointer fixedImage, ImageTypeU3::Pointer movingImage)
{
	// estimates a 3D translation using step wise walk in 3 directions

	TranslationalTransformType::Pointer transform = TranslationalTransformType::New();
	float delta = 4; // in mm step size
	float minLimit = -28; // in mm, min limit of translation in each direction
	float maxLimit = 28; // in mm,  max limit of translation in each direction
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double> InterpolatorType;
	InterpolatorType::Pointer interpolator = InterpolatorType::New();

	// Create a mutual information meric and set its parameters
	typedef itk::MattesMutualInformationImageToImageMetric<ImageTypeU3, ImageTypeU3> MetricType;
	//typedef itk::MeanSquaresImageToImageMetric<ImageTypeU3, ImageTypeU3> MetricType;
	//typedef itk::NormalizedCorrelationImageToImageMetric<ImageTypeU3, ImageTypeU3> MetricType;
	MetricType::Pointer         metric = MetricType::New();
	metric->SetNumberOfSpatialSamples(200000L); // Dont use all pixels, use only selected number of samples
	metric->SetNumberOfHistogramBins(30);
	metric->SetFixedImage(fixedImage);
	metric->SetMovingImage(movingImage);
	metric->SetInterpolator(interpolator);
	metric->SetFixedImageRegion(fixedImage->GetLargestPossibleRegion());
	metric->SetTransform(transform);
	metric->Initialize();

	float bestValue = VTK_FLOAT_MAX;
	TranslationalTransformType::OutputVectorType bestOffset;
	bestOffset[0] = 0; bestOffset[1] = 0; bestOffset[2] = 0;
	TranslationalTransformType::OutputVectorType off;
	for (float x = minLimit; x <= maxLimit; x = x + delta)
		for (float y = minLimit; y <= maxLimit; y = y + delta)
			for (float z = minLimit; z <= maxLimit; z = z + delta)
			{
				// At each step, create a new offset and find the metric value corresponding to that offset
				transform->SetIdentity();
				off[0] = x; off[1] = y; off[2] = z;
				transform->SetOffset(off);
				float currentValue;
				try
				{
					currentValue = metric->GetValue(transform->GetParameters());
				}
				catch (itk::ExceptionObject & err)
				{
					currentValue = VTK_FLOAT_MAX;
					continue;
				}
				if (currentValue < bestValue)
				{
					bestValue = currentValue;
					bestOffset[0] = x; bestOffset[1] = y; bestOffset[2] = z;
				}
			}

	// set transform parameters corresponding to the best offset
	transform->SetIdentity();
	transform->SetOffset(bestOffset);

	return transform;
}

DeformableTransformType::Pointer deformableRegistration(
	ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer movingImage,
	float& optimalMetricValue,
	CompositeTransformType::Pointer initialTransform,
	float numberOfSamplesBSCoarse,
	int numberOfIterationsBSCoarse,
	float bsCoarseMaxStepLength,
	float bsCoarseMinStepLength,
	float bsCoarseRelaxationFactor,
	int numberOfGridNodesInOneDimCoarse
)
{
	// This function runs local optimization using b splines.
	const unsigned int SplineOrder = 3;

	// Defining optimizer, metric, interpolator and image registration method
	typedef itk::RegularStepGradientDescentOptimizer OptimizerType;
	typedef itk::MattesMutualInformationImageToImageMetric<ImageTypeU3, ImageTypeU3> MetricType;
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double> InterpolatorType;
	typedef itk::MultiResolutionImageRegistrationMethod<ImageTypeU3, ImageTypeU3> RegistrationType;
	MetricType::Pointer         metric = MetricType::New();
	OptimizerType::Pointer      optimizer = OptimizerType::New();
	InterpolatorType::Pointer   interpolator = InterpolatorType::New();
	RegistrationType::Pointer   registration = RegistrationType::New();
	registration->SetMetric(metric);
	registration->SetOptimizer(optimizer);
	registration->SetInterpolator(interpolator);

	// set registration parameters
	registration->SetFixedImage(fixedImage);
	registration->SetMovingImage(movingImage);


	registration->SetNumberOfLevels(1);
	optimizer->MinimizeOn();

	// set metric parameters
	metric->SetNumberOfHistogramBins(30);
	metric->ReinitializeSeed(time(NULL));
	//metric->SetUseExplicitPDFDerivatives (false);
	metric->SetUseCachingOfBSplineWeights(false);

	DeformableTransformType::Pointer  bsplineTransformCoarse = DeformableTransformType::New();

	// set grid
	unsigned int numberOfGridNodesInOneDimensionCoarse = numberOfGridNodesInOneDimCoarse;
	typedef DeformableTransformType::RegionType RegionType;
	RegionType bsplineRegion;
	RegionType::SizeType   gridSizeOnImage;
	RegionType::SizeType   gridBorderSize;
	RegionType::SizeType   totalGridSize;
	gridSizeOnImage.Fill(numberOfGridNodesInOneDimensionCoarse);
	gridBorderSize.Fill(SplineOrder);   // Border for spline order = 3 ( 1 lower, 2 upper )
	totalGridSize = gridSizeOnImage + gridBorderSize;

	bsplineRegion.SetSize(totalGridSize);


	// set grid sie and spacing
	typedef DeformableTransformType::SpacingType SpacingType;
	SpacingType spacing = fixedImage->GetSpacing();

	typedef DeformableTransformType::OriginType OriginType;
	OriginType origin = fixedImage->GetOrigin();
	ImageTypeU3::RegionType fixedRegion = fixedImage->GetBufferedRegion();
	const unsigned int numberOfPixels = fixedRegion.GetNumberOfPixels();
	ImageTypeU3::SizeType fixedImageSize = fixedRegion.GetSize();
	registration->SetFixedImageRegion(fixedRegion);

	for (unsigned int r = 0; r < 3; r++)
	{
		spacing[r] *= static_cast<double> (fixedImageSize[r] - 1) /
			static_cast<double> (gridSizeOnImage[r] - 1);
	}

	ImageTypeU3::DirectionType gridDirection = fixedImage->GetDirection();
	SpacingType gridOriginOffset = gridDirection * spacing;

	OriginType gridOrigin = origin - gridOriginOffset;

	// set all parameters of the transform
	bsplineTransformCoarse->SetGridSpacing(spacing);
	bsplineTransformCoarse->SetGridOrigin(gridOrigin);
	bsplineTransformCoarse->SetGridRegion(bsplineRegion);
	bsplineTransformCoarse->SetGridDirection(gridDirection);
	bsplineTransformCoarse->SetBulkTransform(initialTransform); // use initial trasnform as initializer

																// set parameters of the optimizer
	unsigned int numberOfBSplineParameters = bsplineTransformCoarse->GetNumberOfParameters();
	OptimizerType::ScalesType   optimizerScales(numberOfBSplineParameters);
	optimizerScales.Fill(1.0);
	optimizer->SetScales(optimizerScales);
	optimizer->SetMaximumStepLength(bsCoarseMaxStepLength);
	optimizer->SetMinimumStepLength(bsCoarseMinStepLength);
	optimizer->SetRelaxationFactor(bsCoarseRelaxationFactor);
	optimizer->SetNumberOfIterations(numberOfIterationsBSCoarse);

	typedef DeformableTransformType::ParametersType     ParametersType;
	ParametersType initialDeformableTransformParameters(numberOfBSplineParameters);
	initialDeformableTransformParameters.Fill(0.0);
	bsplineTransformCoarse->SetParameters(initialDeformableTransformParameters);

	registration->SetInitialTransformParameters(bsplineTransformCoarse->GetParameters());
	registration->SetTransform(bsplineTransformCoarse);

	metric->SetNumberOfSpatialSamples(numberOfBSplineParameters * numberOfSamplesBSCoarse);

	// Finally start the registration
	std::cout << "Starting Deformable Registration Coarse Grid with " << metric->GetNumberOfSpatialSamples() <<
		" spatial samples" << std::endl;
	try
	{
		registration->Update();
	}
	catch (itk::ExceptionObject & err)
	{
		std::cerr << "ExceptionObject caught in deformable registration!" << std::endl;
		std::cerr << err << std::endl;
		bsplineTransformCoarse->SetParameters(registration->GetInitialTransformParameters());
		optimalMetricValue = metric->GetValue(registration->GetInitialTransformParameters());
		return bsplineTransformCoarse;
	}


	float initialValue = metric->GetValue(registration->GetInitialTransformParameters());
	float afterValue = optimizer->GetValue();
	cout << "before deformable registration metric value " << initialValue << endl;
	cout << "after deformable registration metric value " << afterValue << endl;
	std::cout << "Deformable Registration Coarse Grid completed ";
	std::cout << "in " << optimizer->GetCurrentIteration() << " of " << optimizer->GetNumberOfIterations() << " step" << std::endl;
	OptimizerType::ParametersType finalParameters = registration->GetLastTransformParameters();

	// If initial value of the optimizer is better, then revert the parameters
	if (afterValue < initialValue)
	{
		optimalMetricValue = metric->GetValue(finalParameters);
		bsplineTransformCoarse->SetParameters(finalParameters);
	}
	else
	{
		optimalMetricValue = metric->GetValue(registration->GetInitialTransformParameters());
	}

	return bsplineTransformCoarse;
}


RigidTransformType::Pointer rigidRegistration(
	ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer movingImage,
	float & optimalMetricValue,
	RigidTransformType::Pointer initialTransform,
	int numberOfSamplesRigid,
	int numberOfIterationsRigid,
	float rigidMaxStepLength,
	float rigidMinStepLength
)
{
	typedef itk::RegularStepGradientDescentOptimizer OptimizerType;
	typedef itk::MattesMutualInformationImageToImageMetric<ImageTypeU3, ImageTypeU3> MetricType;
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double> InterpolatorType;
	typedef itk::MultiResolutionImageRegistrationMethod<ImageTypeU3, ImageTypeU3> RegistrationType;

	MetricType::Pointer         metric = MetricType::New();
	OptimizerType::Pointer      optimizer = OptimizerType::New();
	InterpolatorType::Pointer   interpolator = InterpolatorType::New();
	RegistrationType::Pointer   registration = RegistrationType::New();

	registration->SetMetric(metric);
	registration->SetOptimizer(optimizer);
	registration->SetInterpolator(interpolator);
	registration->SetFixedImage(fixedImage);
	registration->SetMovingImage(movingImage);
	registration->SetNumberOfLevels(1);
	optimizer->MinimizeOn();

	metric->SetNumberOfHistogramBins(30);
	metric->ReinitializeSeed(time(NULL));
	metric->SetUseCachingOfBSplineWeights(false);

	RigidTransformType::Pointer  rigidTransform = RigidTransformType::New();
	rigidTransform->SetCenter(initialTransform->GetCenter());
	rigidTransform->SetTranslation(initialTransform->GetTranslation());
	rigidTransform->SetMatrix(initialTransform->GetMatrix());

	ImageTypeU3::RegionType fixedRegion = fixedImage->GetBufferedRegion();
	const unsigned int numberOfPixels = fixedRegion.GetNumberOfPixels();
	registration->SetFixedImageRegion(fixedRegion);
	registration->SetInitialTransformParameters(rigidTransform->GetParameters());
	registration->SetTransform(rigidTransform);

	typedef OptimizerType::ScalesType       OptimizerScalesType;
	OptimizerScalesType optimizerScales(rigidTransform->GetNumberOfParameters());
	const double translationScale = 1.0 / 1000.0;

	optimizerScales[0] = 1.0;
	optimizerScales[1] = 1.0;
	optimizerScales[2] = 1.0;
	optimizerScales[3] = translationScale;
	optimizerScales[4] = translationScale;
	optimizerScales[5] = translationScale;

	optimizer->SetScales(optimizerScales);

	optimizer->SetMaximumStepLength(rigidMaxStepLength);
	optimizer->SetMinimumStepLength(rigidMinStepLength);
	optimizer->SetRelaxationFactor(0.95);
	optimizer->SetNumberOfIterations(numberOfIterationsRigid);
	if (numberOfPixels > numberOfSamplesRigid)
	{
		metric->SetNumberOfSpatialSamples(numberOfSamplesRigid);
		std::cout << "Starting Rigid Registration with " << metric->GetNumberOfSpatialSamples() << " spatial samples of " << numberOfPixels << std::endl;
	}
	else
	{
		metric->UseAllPixelsOn();
		std::cout << "Starting Rigid Registration with all spatial samples (" << numberOfPixels << ")" << std::endl;
	}
	try
	{
		registration->Update();
	}
	catch (itk::ExceptionObject & err)
	{
		std::cerr << "ExceptionObject caught !" << std::endl;
		std::cerr << err << std::endl;
		rigidTransform->SetIdentity();
		rigidTransform->SetCenter(initialTransform->GetCenter());
		rigidTransform->SetTranslation(initialTransform->GetTranslation());
		rigidTransform->SetMatrix(initialTransform->GetMatrix());
		metric->SetFixedImage(fixedImage);
		metric->SetMovingImage(movingImage);
		metric->SetTransform(rigidTransform);
		metric->Initialize();
		optimalMetricValue = metric->GetValue(registration->GetInitialTransformParameters());
		return rigidTransform;
	}
	optimalMetricValue = metric->GetValue(registration->GetInitialTransformParameters());
	std::cout << "Stop Rigid Registration at iteration ";
	std::cout << "in " << optimizer->GetCurrentIteration() << " of " << optimizer->GetNumberOfIterations() << " step" << std::endl;
	cout << "before rigid metric value " << metric->GetValue(registration->GetInitialTransformParameters()) << endl;
	cout << "after rigid metric value " << optimizer->GetValue() << endl;
	float finalMetricValue = optimizer->GetValue();
	if (finalMetricValue < optimalMetricValue)
	{
		rigidTransform->SetParameters(registration->GetLastTransformParameters());
		optimalMetricValue = finalMetricValue;
	}
	return rigidTransform;
}

AffineTransformType::Pointer affineRegistration(
	ImageTypeU3::Pointer fixedImage,
	ImageTypeU3::Pointer movingImage,
	float & optimalMetricValue,
	AffineTransformType::Pointer initialTransform,
	int numberOfSamplesAffine,
	int numberOfIterationsAffine,
	float affineMaxStepLength,
	float affineMinStepLength
)
{
	typedef itk::RegularStepGradientDescentOptimizer OptimizerType;
	typedef itk::MattesMutualInformationImageToImageMetric<ImageTypeU3, ImageTypeU3> MetricType;
	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double> InterpolatorType;
	typedef itk::MultiResolutionImageRegistrationMethod<ImageTypeU3, ImageTypeU3> RegistrationType;

	MetricType::Pointer         metric = MetricType::New();
	OptimizerType::Pointer      optimizer = OptimizerType::New();
	InterpolatorType::Pointer   interpolator = InterpolatorType::New();
	RegistrationType::Pointer   registration = RegistrationType::New();

	registration->SetMetric(metric);
	registration->SetOptimizer(optimizer);
	registration->SetInterpolator(interpolator);
	registration->SetFixedImage(fixedImage);
	registration->SetMovingImage(movingImage);
	registration->SetNumberOfLevels(1);

	optimizer->MinimizeOn();
	metric->SetNumberOfHistogramBins(30);
	metric->ReinitializeSeed(time(NULL));
	metric->SetUseCachingOfBSplineWeights(false);

	AffineTransformType::Pointer  affineTransform = AffineTransformType::New();
	affineTransform->SetCenter(initialTransform->GetCenter());
	affineTransform->SetTranslation(initialTransform->GetTranslation());
	affineTransform->SetMatrix(initialTransform->GetMatrix());

	ImageTypeU3::RegionType fixedRegion = fixedImage->GetBufferedRegion();
	const unsigned int numberOfPixels = fixedRegion.GetNumberOfPixels();
	registration->SetFixedImageRegion(fixedRegion);
	registration->SetInitialTransformParameters(affineTransform->GetParameters());
	registration->SetTransform(affineTransform);

	typedef OptimizerType::ScalesType       OptimizerScalesType;
	OptimizerScalesType optimizerScales(affineTransform->GetNumberOfParameters());
	const double translationScale = 1.0 / 1000.0;

	optimizerScales[0] = 1.0;
	optimizerScales[1] = 1.0;
	optimizerScales[2] = 1.0;
	optimizerScales[3] = 1.0;
	optimizerScales[4] = 1.0;
	optimizerScales[5] = 1.0;
	optimizerScales[6] = 1.0;
	optimizerScales[7] = 1.0;
	optimizerScales[8] = 1.0;
	optimizerScales[9] = translationScale;
	optimizerScales[10] = translationScale;
	optimizerScales[11] = translationScale;

	optimizer->SetScales(optimizerScales);

	optimizer->SetMaximumStepLength(affineMaxStepLength);
	optimizer->SetMinimumStepLength(affineMinStepLength);
	optimizer->SetRelaxationFactor(0.95);
	optimizer->SetNumberOfIterations(numberOfIterationsAffine);
	if (numberOfPixels > numberOfSamplesAffine)
	{
		metric->SetNumberOfSpatialSamples(numberOfSamplesAffine);
		std::cout << "Starting Affine Registration with " << metric->GetNumberOfSpatialSamples() << " spatial samples of " << numberOfPixels << std::endl;
	}
	else
	{
		metric->UseAllPixelsOn();
		std::cout << "Starting Affine Registration with all spatial samples (" << numberOfPixels << ")" << std::endl;
	}
	try
	{
		registration->Update();
	}
	catch (itk::ExceptionObject & err)
	{
		std::cerr << "ExceptionObject caught !" << std::endl;
		std::cerr << err << std::endl;
		affineTransform->SetIdentity();
		affineTransform->SetCenter(initialTransform->GetCenter());
		affineTransform->SetTranslation(initialTransform->GetTranslation());
		affineTransform->SetMatrix(initialTransform->GetMatrix());
		metric->SetFixedImage(fixedImage);
		metric->SetMovingImage(movingImage);
		metric->SetTransform(affineTransform);
		metric->Initialize();
		optimalMetricValue = metric->GetValue(registration->GetInitialTransformParameters());
		return affineTransform;
	}
	optimalMetricValue = metric->GetValue(registration->GetInitialTransformParameters());
	std::cout << "Stop Affine Registration at iteration ";
	std::cout << "in " << optimizer->GetCurrentIteration() << " of " << optimizer->GetNumberOfIterations() << " step" << std::endl;
	cout << "before Affine metric value " << metric->GetValue(registration->GetInitialTransformParameters()) << endl;
	cout << "after Affine metric value " << optimizer->GetValue() << endl;
	float finalMetricValue = optimizer->GetValue();
	if (finalMetricValue < optimalMetricValue)
	{
		affineTransform->SetParameters(registration->GetLastTransformParameters());
		optimalMetricValue = finalMetricValue;
	}
	return affineTransform;
}

ImageTypeU3::Pointer thresholdImageWithMaskCT(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask)
{
	//saveImage<ImageTypeU3>(mask, "Mask.mhd");

	//ImageTypeU3::Pointer croppedImage = cropImage(image, mask);
	typedef itk::DiscreteGaussianImageFilter<ImageTypeU3, ImageTypeU3 > GaussianFilterType;
	GaussianFilterType::Pointer smoother = GaussianFilterType::New();
	smoother->SetInput(image);
	const double sigmaX = 0.1;
	smoother->SetVariance(sigmaX);
	smoother->Update();
	//ImageTypeU3::Pointer targetImageSmooth = smoother->GetOutput();
	//saveImage<ImageTypeU3>(smoother->GetOutput(), "MaskImageSmooth.mhd");

	//int factor = getMeanFromImageandMask(smoother->GetOutput(), mask);

	//typedef itk::StatisticsImageFilter<ImageTypeU3> StatisticsImageFilterType;
	//StatisticsImageFilterType::Pointer statisticsImageFilter = StatisticsImageFilterType::New();
	//statisticsImageFilter->SetInput(smoother->GetOutput());
	//statisticsImageFilter->Update();
	//int meanVal = statisticsImageFilter->GetMean();
	//int factor = meanVal - statisticsImageFilter->GetSigma() / 4.0;
	//cout << "factor 1 " << factor << endl;

	float variance;
	int factor = getMeanFromImageandMask(image, mask, variance);
	//cout << "factor 2 " << factor << endl;
	factor = ((float)factor) - variance / 3.0;
	cout << "factor 3 " << factor << endl;

	typedef itk::BinaryThresholdImageFilter <ImageTypeU3, ImageTypeU3>		ThresholdImageFilterType;
	ThresholdImageFilterType::Pointer lowerthresholdFilter = ThresholdImageFilterType::New();
	lowerthresholdFilter->SetInput(smoother->GetOutput());
	lowerthresholdFilter->SetOutsideValue(0);
	lowerthresholdFilter->SetInsideValue(255);
	lowerthresholdFilter->SetLowerThreshold(0);
	lowerthresholdFilter->SetUpperThreshold(factor);
	lowerthresholdFilter->Update();
	//cout << "mean ....." << statisticsImageFilter->GetMean() << endl;
	//cout << "variance ....." << statisticsImageFilter->GetSigma() << endl;
	//saveImage<ImageTypeU3>(lowerthresholdFilter->GetOutput(), "MaskThreshold.mhd");

	typedef itk::AndImageFilter <ImageTypeU3>		AndImageFilterType;
	AndImageFilterType::Pointer andFilter = AndImageFilterType::New();
	andFilter->SetInput(0, lowerthresholdFilter->GetOutput());
	andFilter->SetInput(1, mask);
	andFilter->Update();

	typedef itk::BinaryBallStructuringElement<ImageTypeU3::PixelType, 3>  StructuringElementType;
	StructuringElementType structuringElement;
	structuringElement.SetRadius(2);
	structuringElement.CreateStructuringElement();

	////typedef itk::BinaryDilateImageFilter <ImageTypeU3, ImageTypeU3, StructuringElementType>	BinaryDilateImageFilterType;
	////BinaryDilateImageFilterType::Pointer dilateFilter = BinaryDilateImageFilterType::New();
	////dilateFilter->SetInput(andFilter->GetOutput());
	////dilateFilter->SetKernel(structuringElement);
	////dilateFilter->Update();

	StructuringElementType structuringElement2;
	structuringElement2.SetRadius(1);
	structuringElement2.CreateStructuringElement();
	typedef itk::BinaryMorphologicalOpeningImageFilter <ImageTypeU3, ImageTypeU3, StructuringElementType>	BinaryMorphologicalOpeningImageFilterType;
	BinaryMorphologicalOpeningImageFilterType::Pointer openingFilter = BinaryMorphologicalOpeningImageFilterType::New();
	openingFilter->SetInput(andFilter->GetOutput());
	openingFilter->SetKernel(structuringElement2);
	openingFilter->Update();

	typedef itk::BinaryMorphologicalClosingImageFilter <ImageTypeU3, ImageTypeU3, StructuringElementType>	BinaryMorphologicalClosingImageFilterType;
	BinaryMorphologicalClosingImageFilterType::Pointer closingFilter = BinaryMorphologicalClosingImageFilterType::New();
	closingFilter->SetInput(openingFilter->GetOutput());
	closingFilter->SetKernel(structuringElement);
	closingFilter->Update();

	AndImageFilterType::Pointer andFilter2 = AndImageFilterType::New();
	andFilter2->SetInput(0, closingFilter->GetOutput());
	andFilter2->SetInput(1, lowerthresholdFilter->GetOutput());
	andFilter2->Update();

	//////typedef itk::VotingBinaryIterativeHoleFillingImageFilter< ImageTypeU3 > FilterType;
	//////FilterType::InputSizeType radius;
	//////radius.Fill(3);
	//////FilterType::Pointer filter = FilterType::New();
	//////filter->SetInput(lowerthresholdFilter->GetOutput());
	//////filter->SetRadius(radius);
	////////filter->SetMajorityThreshold(majorityThreshold);
	//////filter->SetBackgroundValue(itk::NumericTraits< ImageTypeU3::PixelType >::Zero);
	//////filter->SetForegroundValue(itk::NumericTraits< ImageTypeU3::PixelType >::max());
	//////filter->SetMaximumNumberOfIterations(5);
	////saveImage<ImageTypeU3>(dilateFilter->GetOutput(), "MaskThresholdDilate.mhd");
	//saveImage<ImageTypeU3>(openingFilter->GetOutput(), "MaskThresholdOpen.mhd");
	//saveImage<ImageTypeU3>(closingFilter->GetOutput(), "MaskThresholdClose.mhd");
	//saveImage<ImageTypeU3>(erodeFilter->GetOutput(), "MaskThresholdErode.mhd");
	//saveImage<ImageTypeU3>(andFilter2->GetOutput(), "MaskThresholdFinal.mhd");

	return andFilter2->GetOutput();
}

ImageTypeU3::PointType getPhysicalCenterOfBinaryImage(ImageTypeU3::Pointer image)
{
	ImageTypeU3::IndexType regionIndex;
	regionIndex[0] = 0;
	regionIndex[1] = 0;
	regionIndex[2] = 0;

	ImageTypeU3::RegionType region;
	region.SetSize(image->GetLargestPossibleRegion().GetSize());
	region.SetIndex(regionIndex);
	itk::ImageRegionIterator<ImageTypeU3> imageIterator(image, region);
	float sumX = 0, sumY = 0, sumZ = 0;
	ImageTypeU3::PointType pt;
	imageIterator.Begin();
	float numbers = 0;
	while (!imageIterator.IsAtEnd())
	{
		// Get the value of the current pixel
		//unsigned char val = imageIterator.Get();
		//std::cout << (int)val << std::endl;
		if (imageIterator.Get() != 0)
		{
			image->TransformIndexToPhysicalPoint(imageIterator.GetIndex(), pt);
			sumX = sumX + pt[0];
			sumY = sumY + pt[1];
			sumZ = sumZ + pt[2];
			numbers++;
		}
		++imageIterator;
	}

	pt[0] = sumX / numbers;
	pt[1] = sumY / numbers;
	pt[2] = sumZ / numbers;

	return pt;

}

int getMeanFromImageandMask(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask, float &variance)
{

	ImageTypeU3::IndexType regionIndex;
	regionIndex[0] = 0;
	regionIndex[1] = 0;
	regionIndex[2] = 0;

	vector<int> numbers;
	ImageTypeU3::RegionType region;
	region.SetSize(image->GetLargestPossibleRegion().GetSize());
	region.SetIndex(regionIndex);
	itk::ImageRegionIterator<ImageTypeU3> maskIterator(mask, region);
	itk::ImageRegionIterator<ImageTypeU3> imageIterator(image, region);
	while (!imageIterator.IsAtEnd())
	{
		// Get the value of the current pixel
		//unsigned char val = imageIterator.Get();
		//std::cout << (int)val << std::endl;
		if (maskIterator.Get() != 0)
			numbers.push_back(imageIterator.Get());

		++imageIterator;
		++maskIterator;
	}

	double sum = std::accumulate(numbers.begin(), numbers.end(), 0.0);
	int meanVal = sum / numbers.size();

	std::vector<double> diff(numbers.size());
	std::transform(numbers.begin(), numbers.end(), diff.begin(), [meanVal](double x) { return x - meanVal; });
	double sq_sum = std::inner_product(diff.begin(), diff.end(), diff.begin(), 0.0);
	variance = std::sqrt(sq_sum / numbers.size());

	//cout << "mean is " << meanVal << "\t and variance is \t " << variance << endl;

	return meanVal;
}

ImageTypeU3::Pointer thresholdImageWithMaskMRI(ImageTypeU3::Pointer image, ImageTypeU3::Pointer mask)
{

	//ImageTypeU3::Pointer croppedImage = cropImage(image, mask);
	typedef itk::DiscreteGaussianImageFilter<ImageTypeU3, ImageTypeU3 > GaussianFilterType;
	GaussianFilterType::Pointer smoother = GaussianFilterType::New();
	smoother->SetInput(image);
	const double sigmaX = 0.1;
	smoother->SetVariance(sigmaX);
	smoother->Update();
	//ImageTypeU3::Pointer targetImageSmooth = smoother->GetOutput();
	//saveImage<ImageTypeU3>(smoother->GetOutput(), "MaskImageSmooth.mhd");

	//int factor = getMeanFromImageandMask(smoother->GetOutput(), mask);

	//typedef itk::StatisticsImageFilter<ImageTypeU3> StatisticsImageFilterType;
	//StatisticsImageFilterType::Pointer statisticsImageFilter = StatisticsImageFilterType::New();
	//statisticsImageFilter->SetInput(smoother->GetOutput());
	//statisticsImageFilter->Update();
	//int meanVal = statisticsImageFilter->GetMean();
	//int factor = ((float) meanVal) / 4.0;// +statisticsImageFilter->GetSigma() / 4.0;
	////cout << "factor MRI 1 " << factor << endl;

	float variance;
	int factor = getMeanFromImageandMask(image, mask, variance);
	//cout << "factor MRI 2 " << factor << endl;
	factor = ((float)factor) - variance / 3.0;
	//cout << "factor MRI 3 " << factor << endl;

	typedef itk::BinaryThresholdImageFilter <ImageTypeU3, ImageTypeU3>		ThresholdImageFilterType;
	ThresholdImageFilterType::Pointer lowerthresholdFilter = ThresholdImageFilterType::New();
	lowerthresholdFilter->SetInput(smoother->GetOutput());
	lowerthresholdFilter->SetOutsideValue(0);
	lowerthresholdFilter->SetInsideValue(255);
	lowerthresholdFilter->SetLowerThreshold(0);
	lowerthresholdFilter->SetUpperThreshold(factor);
	lowerthresholdFilter->Update();
	//cout << "mean ....." << statisticsImageFilter->GetMean() << endl;
	//cout << "variance ....." << statisticsImageFilter->GetSigma() << endl;
	//saveImage<ImageTypeU3>(lowerthresholdFilter->GetOutput(), "MaskThreshold.mhd");

	typedef itk::AndImageFilter <ImageTypeU3>		AndImageFilterType;
	AndImageFilterType::Pointer andFilter = AndImageFilterType::New();
	andFilter->SetInput(0, lowerthresholdFilter->GetOutput());
	andFilter->SetInput(1, mask);
	andFilter->Update();

	typedef itk::BinaryBallStructuringElement<ImageTypeU3::PixelType, 3>  StructuringElementType;
	StructuringElementType structuringElement;
	structuringElement.SetRadius(4);
	structuringElement.CreateStructuringElement();
	typedef itk::BinaryMorphologicalClosingImageFilter <ImageTypeU3, ImageTypeU3, StructuringElementType>	BinaryMorphologicalClosingImageFilterType;
	BinaryMorphologicalClosingImageFilterType::Pointer closingFilter = BinaryMorphologicalClosingImageFilterType::New();
	closingFilter->SetInput(andFilter->GetOutput());
	closingFilter->SetKernel(structuringElement);
	closingFilter->Update();

	return closingFilter->GetOutput();
}

ImageTypeU3::Pointer getLargestConnectedRegion(ImageTypeU3::Pointer nasopharynxImage, int numberComponents)
{
	typedef itk::BinaryThresholdImageFilter <ImageTypeU3, ImageTypeU3>		ThresholdImageFilterType;
	ThresholdImageFilterType::Pointer lowerthresholdFilter = ThresholdImageFilterType::New();
	lowerthresholdFilter->SetInput(nasopharynxImage);
	lowerthresholdFilter->SetOutsideValue(255);
	lowerthresholdFilter->SetInsideValue(0);
	lowerthresholdFilter->SetLowerThreshold(0);
	lowerthresholdFilter->SetUpperThreshold(0);
	lowerthresholdFilter->Update();

	typedef itk::ConnectedComponentImageFilter <ImageTypeU3, ImageTypeInt16 >		ConnectedComponentImageFilterType;
	ConnectedComponentImageFilterType::Pointer connected = ConnectedComponentImageFilterType::New();
	connected->SetInput(lowerthresholdFilter->GetOutput());
	connected->Update();

	std::cout << "Number of objects: " << connected->GetObjectCount() << std::endl;
	int minCount = std::min(numberComponents, (int)connected->GetObjectCount());
	cout << "min objects: " << minCount << endl;

	typedef itk::LabelShapeKeepNObjectsImageFilter< ImageTypeInt16 > LabelShapeKeepNObjectsImageFilterType;
	LabelShapeKeepNObjectsImageFilterType::Pointer labelShapeKeepNObjectsImageFilter = LabelShapeKeepNObjectsImageFilterType::New();
	labelShapeKeepNObjectsImageFilter->SetInput(connected->GetOutput());
	labelShapeKeepNObjectsImageFilter->SetBackgroundValue(0);
	labelShapeKeepNObjectsImageFilter->SetNumberOfObjects(minCount);
	labelShapeKeepNObjectsImageFilter->SetAttribute(LabelShapeKeepNObjectsImageFilterType::LabelObjectType::NUMBER_OF_PIXELS);
	labelShapeKeepNObjectsImageFilter->Update();

	typedef itk::BinaryThresholdImageFilter <ImageTypeInt16, ImageTypeU3>		ThresholdImageFilterType2;
	ThresholdImageFilterType2::Pointer thresholdFilter = ThresholdImageFilterType2::New();
	thresholdFilter->SetInput(labelShapeKeepNObjectsImageFilter->GetOutput());
	thresholdFilter->SetOutsideValue(255);
	thresholdFilter->SetInsideValue(0);
	thresholdFilter->SetLowerThreshold(0);
	thresholdFilter->SetUpperThreshold(0);
	thresholdFilter->Update();

	//typedef itk::RescaleIntensityImageFilter< ImageTypeU3, ImageTypeU3 > RescaleFilterType;
	//RescaleFilterType::Pointer rescaleFilter = RescaleFilterType::New();
	//rescaleFilter->SetOutputMinimum(0);
	//rescaleFilter->SetOutputMaximum(itk::NumericTraits<ImageTypeU3::PixelType>::max());
	//rescaleFilter->SetInput(labelShapeKeepNObjectsImageFilter->GetOutput());
	//rescaleFilter->Update();

	return thresholdFilter->GetOutput();
}

vector<ImageTypeU3::PointType> getCylinderCenters(MaskImageType3D::Pointer image)
{
	vector<ImageTypeU3::PointType> centers;

	typedef itk::SubtractImageFilter <ImageTypeU3, ImageTypeU3 >		SubtractImageFilterType;

	MaskImageType3D::Pointer input1 = getLargestConnectedRegion(image, 1);
	centers.push_back(getPhysicalCenterOfBinaryImage(input1));
	cout << centers[0][0] << "\t" << centers[0][1] << "\t" << centers[0][2];
	SubtractImageFilterType::Pointer subtractFilter1 = SubtractImageFilterType::New();
	subtractFilter1->SetInput1(image);
	subtractFilter1->SetInput2(input1);
	subtractFilter1->Update();

	MaskImageType3D::Pointer input2 = getLargestConnectedRegion(subtractFilter1->GetOutput(), 1);
	centers.push_back(getPhysicalCenterOfBinaryImage(input2));
	cout << centers[1][0] << "\t" << centers[1][1] << "\t" << centers[1][2];
	SubtractImageFilterType::Pointer subtractFilter2 = SubtractImageFilterType::New();
	subtractFilter2->SetInput1(subtractFilter1->GetOutput());
	subtractFilter2->SetInput2(input2);
	subtractFilter2->Update();

	MaskImageType3D::Pointer input3 = getLargestConnectedRegion(subtractFilter2->GetOutput(), 1);
	centers.push_back(getPhysicalCenterOfBinaryImage(input3));
	cout << centers[2][0] << "\t" << centers[2][1] << "\t" << centers[2][2];

	return centers;
}


vtkSmartPointer<vtkPolyData> transformSurface(vtkSmartPointer<vtkPolyData> inputSurface, vtkSmartPointer<vtkTransform> transform)
{
	vtkSmartPointer<vtkTransformPolyDataFilter> transformFilter = vtkSmartPointer<vtkTransformPolyDataFilter>::New();
	transformFilter->SetInputData(inputSurface);
	transformFilter->SetTransform(transform);
	transformFilter->Update();



	return transformFilter->GetOutput();

}

vtkSmartPointer<vtkPolyData>  createCylinder(float XCenter, float YCenter, float ZCenter, float cylinderRadius, float cylinderHeight)
{
	vtkSmartPointer<vtkCylinderSource> cylinderSource = vtkSmartPointer<vtkCylinderSource>::New();
	cylinderSource->SetCenter(XCenter, YCenter, ZCenter);
	cylinderSource->SetRadius(cylinderRadius);
	cylinderSource->SetHeight(cylinderHeight);
	cylinderSource->SetResolution(1000);
	cylinderSource->Update();

	vtkSmartPointer<vtkTransform> initTx = vtkSmartPointer<vtkTransform>::New();
	initTx->Translate(XCenter, YCenter, ZCenter);
	initTx->RotateX(90);
	initTx->Translate(-XCenter, -YCenter, -ZCenter);
	vtkSmartPointer<vtkTransformPolyDataFilter> transformFilter = vtkSmartPointer<vtkTransformPolyDataFilter>::New();
	transformFilter->SetInputData(cylinderSource->GetOutput());
	transformFilter->SetTransform(initTx);
	transformFilter->Update();

	vtkSmartPointer<vtkTriangleFilter>		tris = vtkTriangleFilter::New();
	tris->SetInputData(transformFilter->GetOutput());
	tris->Update();

	return tris->GetOutput();
}

ImageTypeU3::Pointer getImageFromPolyData(vtkSmartPointer<vtkPolyData> inputSurface, ImageTypeU3::Pointer referenceImage, bool takeUnion)
{
	vtkSmartPointer<vtkImageData> whiteImage = vtkSmartPointer<vtkImageData>::New();
	double bounds[6];
	inputSurface->GetBounds(bounds);
	double spacing[3]; // desired volume spacing
	spacing[0] = 0.3;
	spacing[1] = 0.3;
	spacing[2] = 0.3;
	whiteImage->SetSpacing(spacing);

	// compute dimensions
	int dim[3];
	for (int i = 0; i < 3; i++)
	{
		dim[i] = static_cast<int>(ceil((bounds[i * 2 + 1] - bounds[i * 2]) / spacing[i]));
	}
	whiteImage->SetDimensions(dim);
	whiteImage->SetExtent(0, dim[0] - 1, 0, dim[1] - 1, 0, dim[2] - 1);

	double origin[3];
	origin[0] = bounds[0] + spacing[0] / 2;
	origin[1] = bounds[2] + spacing[1] / 2;
	origin[2] = bounds[4] + spacing[2] / 2;
	whiteImage->SetOrigin(origin);

	whiteImage->AllocateScalars(VTK_UNSIGNED_CHAR, 1);

	// fill the image with foreground voxels:
	unsigned char inval = 255;
	unsigned char outval = 0;
	vtkIdType count = whiteImage->GetNumberOfPoints();
	for (vtkIdType i = 0; i < count; ++i)
	{
		whiteImage->GetPointData()->GetScalars()->SetTuple1(i, inval);
	}

	// polygonal data --> image stencil:
	vtkSmartPointer<vtkPolyDataToImageStencil> pol2stenc =
		vtkSmartPointer<vtkPolyDataToImageStencil>::New();

	pol2stenc->SetInputData(inputSurface);

	pol2stenc->SetOutputOrigin(origin);
	pol2stenc->SetOutputSpacing(spacing);
	pol2stenc->SetOutputWholeExtent(whiteImage->GetExtent());
	pol2stenc->Update();

	// cut the corresponding white image and set the background:
	vtkSmartPointer<vtkImageStencil> imgstenc =
		vtkSmartPointer<vtkImageStencil>::New();

	imgstenc->SetInputData(whiteImage);
	imgstenc->SetStencilConnection(pol2stenc->GetOutputPort());

	imgstenc->ReverseStencilOff();
	imgstenc->SetBackgroundValue(outval);
	imgstenc->Update();

	//vtkSmartPointer<vtkMetaImageWriter> writer =
	//	vtkSmartPointer<vtkMetaImageWriter>::New();
	//writer->SetFileName("CenterVolume.mhd");

	//writer->SetInputData(imgstenc->GetOutput());

	//writer->Write();

	typedef itk::VTKImageToImageFilter< ImageTypeU3 > converterType;
	converterType::Pointer converter = converterType::New();
	converter->SetInput(imgstenc->GetOutput());
	converter->Update();

	if (referenceImage.IsNull())
		return converter->GetOutput();


	typedef itk::ResampleImageFilter<ImageTypeU3, ImageTypeU3> ResampleSegmentationFilterType;
	typedef itk::NearestNeighborInterpolateImageFunction<ImageTypeU3, double >  InterpolatorType;
	InterpolatorType::Pointer interpolator = InterpolatorType::New();
	ResampleSegmentationFilterType::Pointer segmentationResampler = ResampleSegmentationFilterType::New();
	segmentationResampler->SetInput(converter->GetOutput());
	segmentationResampler->SetSize(referenceImage->GetLargestPossibleRegion().GetSize());
	segmentationResampler->SetOutputOrigin(referenceImage->GetOrigin());
	segmentationResampler->SetOutputSpacing(referenceImage->GetSpacing());
	segmentationResampler->SetOutputDirection(referenceImage->GetDirection());
	segmentationResampler->SetInterpolator(interpolator);
	segmentationResampler->Update();

	//targetSegmentationNewResampled = segmentationResampler->GetOutput();

	if (!takeUnion)
		return segmentationResampler->GetOutput();

	typedef itk::OrImageFilter <ImageTypeU3>		OrImageFilterType;
	OrImageFilterType::Pointer orFilter = OrImageFilterType::New();
	orFilter->SetInput(0, segmentationResampler->GetOutput());
	orFilter->SetInput(1, referenceImage);
	orFilter->Update();

	return orFilter->GetOutput();

}

ImageTypeU3::Pointer transformImage(ImageTypeU3::Pointer input, ImageTypeU3::Pointer targetImage, DeformableTransformType::Pointer bsplineTx, ImageTypeU3::Pointer andMask)
{
	typedef itk::ResampleImageFilter<MaskImageType3D, MaskImageType3D> ResampleSegmentationFilterType;
	typedef itk::NearestNeighborInterpolateImageFunction<MaskImageType3D, double >  InterpolatorType;

	InterpolatorType::Pointer interpolator2 = InterpolatorType::New();
	ResampleSegmentationFilterType::Pointer segmentationResampler2 = ResampleSegmentationFilterType::New();
	if (bsplineTx)
		segmentationResampler2->SetTransform(bsplineTx);
	segmentationResampler2->SetInput(input);
	segmentationResampler2->SetSize(targetImage->GetLargestPossibleRegion().GetSize());
	segmentationResampler2->SetOutputOrigin(targetImage->GetOrigin());
	segmentationResampler2->SetOutputSpacing(targetImage->GetSpacing());
	segmentationResampler2->SetOutputDirection(targetImage->GetDirection());
	segmentationResampler2->SetInterpolator(interpolator2);
	segmentationResampler2->UpdateLargestPossibleRegion();

	typedef itk::BinaryThresholdImageFilter <ImageTypeU3, ImageTypeU3>		ThresholdImageFilterType;
	ThresholdImageFilterType::Pointer lowerthresholdFilter = ThresholdImageFilterType::New();
	lowerthresholdFilter->SetInput(segmentationResampler2->GetOutput());
	lowerthresholdFilter->SetOutsideValue(255);
	lowerthresholdFilter->SetInsideValue(0);
	lowerthresholdFilter->SetLowerThreshold(0);
	lowerthresholdFilter->SetUpperThreshold(0);
	lowerthresholdFilter->Update();

	if (andMask)
	{
		typedef itk::AndImageFilter <ImageTypeU3>		AndImageFilterType;
		AndImageFilterType::Pointer andFilter = AndImageFilterType::New();
		andFilter->SetInput(0, lowerthresholdFilter->GetOutput());
		andFilter->SetInput(1, andMask);
		andFilter->Update();
		return andFilter->GetOutput();
	}

	return lowerthresholdFilter->GetOutput();
}

vtkSmartPointer<vtkPolyData> createSurface(ImageTypeU3::Pointer input)
{
	typedef itk::ConstantPadImageFilter <ImageTypeU3, ImageTypeU3>		ConstantPadImageFilterType;
	ImageTypeU3::SizeType lowerExtendRegion;
	lowerExtendRegion[0] = 1;
	lowerExtendRegion[1] = 1;
	lowerExtendRegion[2] = 1;

	ImageTypeU3::SizeType upperExtendRegion;
	upperExtendRegion[0] = 1;
	upperExtendRegion[1] = 1;
	upperExtendRegion[2] = 1;

	ImageTypeU3::PixelType constantPixel = 0;

	ConstantPadImageFilterType::Pointer padFilter = ConstantPadImageFilterType::New();
	padFilter->SetInput(input);
	//padFilter->SetPadBound(outputRegion); // Calls SetPadLowerBound(region) and SetPadUpperBound(region)
	padFilter->SetPadLowerBound(lowerExtendRegion);
	padFilter->SetPadUpperBound(upperExtendRegion);
	padFilter->SetConstant(constantPixel);
	padFilter->Update();
	ImageTypeU3::Pointer finalOutput = padFilter->GetOutput();
	//saveImage<ImageTypeU3>(finalOutput, "finalOutput.mhd");

	// Now we transform the target segmentation from itk to vtk format
	typedef itk::ImageToVTKImageFilter<MaskImageType3D> ITKtoVTKImageConverterType;
	ITKtoVTKImageConverterType::Pointer ITKtoVTKImageConverterter = ITKtoVTKImageConverterType::New();
	ITKtoVTKImageConverterter->SetInput(finalOutput);
	ITKtoVTKImageConverterter->Update();
	vtkSmartPointer<vtkImageData> vtktargetSegmentation = ITKtoVTKImageConverterter->GetOutput();

	// Now we create a 3D surface from individual image points using Marching cubes 
	vtkSmartPointer<vtkDiscreteMarchingCubes> surface = vtkSmartPointer<vtkDiscreteMarchingCubes>::New();
	surface->SetInputData(vtktargetSegmentation);
	//surface->SetLocator
	surface->Update();
	vtkSmartPointer<vtkPolyData> targetSurface = surface->GetOutput();

	// during itk->vtk conversion, the directionality is lost. We now restore the orientation to the the vtk surface by transforming it 
	// according to the original ik direction. 
	MaskImageType3D::DirectionType d = finalOutput->GetDirection();
	vtkMatrix4x4* dirMat = vtkMatrix4x4::New();
	dirMat->SetElement(0, 0, d(0, 0)); dirMat->SetElement(0, 1, d(0, 1)); dirMat->SetElement(0, 2, d(0, 2)); dirMat->SetElement(0, 3, 0);
	dirMat->SetElement(1, 0, d(1, 0)); dirMat->SetElement(1, 1, d(1, 1)); dirMat->SetElement(1, 2, d(1, 2)); dirMat->SetElement(1, 3, 0);
	dirMat->SetElement(2, 0, d(2, 0)); dirMat->SetElement(2, 1, d(2, 1)); dirMat->SetElement(2, 2, d(2, 2)); dirMat->SetElement(2, 3, 0);
	dirMat->SetElement(3, 0, 0); dirMat->SetElement(3, 1, 0); dirMat->SetElement(3, 2, 0); dirMat->SetElement(3, 3, 1);
	vtkSmartPointer<vtkTransform> vtkDir = vtkSmartPointer<vtkTransform>::New();
	vtkDir->SetMatrix(dirMat);
	vtkSmartPointer<vtkTransform> vtkTx = vtkSmartPointer<vtkTransform>::New();
	vtkTx->Translate(finalOutput->GetOrigin()[0], finalOutput->GetOrigin()[1], finalOutput->GetOrigin()[2]);
	vtkTx->Concatenate(vtkDir);
	vtkTx->Translate(-finalOutput->GetOrigin()[0], -finalOutput->GetOrigin()[1], -finalOutput->GetOrigin()[2]);
	vtkTx->Update();
	vtkSmartPointer<vtkTransformPolyDataFilter> transformFilter = vtkSmartPointer<vtkTransformPolyDataFilter>::New();
	transformFilter->SetInputData(targetSurface);
	transformFilter->SetTransform(vtkTx);
	transformFilter->Update();

	return transformFilter->GetOutput();

}

vtkSmartPointer<vtkPolyData> getSurface(ImageTypeU3::Pointer input, ImageTypeU3::Pointer targetImage, DeformableTransformType::Pointer bsplineTx)
{
	ImageTypeU3::Pointer transformedImage = transformImage(input, targetImage, bsplineTx, NULL); // lies in targetImage space
	return createSurface(transformedImage);

}

vector<vtkSmartPointer<vtkPolyData>>  findSurfaceOnTarget(ImageTypeU3::Pointer targetImage,
	ImageTypeU3::Pointer referenceImage,
	MaskImageType3D::Pointer referenceSegmentationROI,
	MaskImageType3D::Pointer referenceSegmentationContours,
//	MaskImageType3D::Pointer refMask,
	MaskImageType3D::Pointer refCylinders,
	MaskImageType3D::Pointer refCylindersBoundaries,
//	MaskImageType3D::Pointer refEntranceMask,
//	MaskImageType3D::Pointer refNasopharynxMask,
	bool isSimple,
	bool isCT,
	float & metricValue,
	vector<ImageTypeU3::PointType>  & centers)
{
	vector<vtkSmartPointer<vtkPolyData>> surfaces;
	centers.clear();
	float compositeMetric, withMaskMetric = VTK_FLOAT_MAX, withoutMaskMetric = VTK_FLOAT_MAX;

	//saveImage<ImageTypeU3>(targetImage, "targetImage.mhd");
	cout << "finding surface started...." << endl;

	// first we smooth our target image. During rigid and affine matching we will use the smooth version instead of original images in order
	// to create avoid local maximas during optimization
	typedef itk::DiscreteGaussianImageFilter<ImageTypeU3, ImageTypeU3 > GaussianFilterType;
	GaussianFilterType::Pointer smoother = GaussianFilterType::New();
	smoother->SetInput(targetImage);
	const double sigmaX = 4.0;
	smoother->SetVariance(sigmaX);
	smoother->Update();
	ImageTypeU3::Pointer targetImageSmooth = smoother->GetOutput();

	// Now we find the optimal composite transform (rigid + affine) between target and reference image.
	// There are some images in which the field of view is cropped such that only nasal channels are acquired. For others, whole head acquistion
	// is done. We therefore take care of this by first finding a good match between target and reference images, where only a selected
	// portion of head (including nasal channels) are used for matching. A mask identifies the portion to be selected. In the 2nd phase, whole 
	// is used for matching and out of the two schemes, that rigid + affine transform is selected which results in a better similarity metric.

	CompositeTransformType::Pointer compositeTransform;
	CompositeTransformType::Pointer withMaskTransform = findOptimalCompositeTranform(targetImage, targetImageSmooth, referenceImage, referenceSegmentationContours, true, withMaskMetric, isSimple);
	CompositeTransformType::Pointer withoutMaskTransform = findOptimalCompositeTranform(targetImage, targetImageSmooth, referenceImage, referenceSegmentationContours, false, withoutMaskMetric, isSimple);

	targetImageSmooth = NULL;
	referenceSegmentationContours = NULL;

	// Select the best metric, reference and transform out of the two schemes
	ImageTypeU3::Pointer selectedReference;
/*	if (withMaskMetric < withoutMaskMetric)
	{
		compositeMetric = withMaskMetric;
		compositeTransform = withMaskTransform;
		selectedReference = cropImage(referenceImage, refMask);
	}*/
//	else
//	{
		compositeMetric = withoutMaskMetric;
		compositeTransform = withoutMaskTransform;
		selectedReference = referenceImage;
//	}
	cout << "composite metric " << compositeMetric << endl;


	// save affine matching if you like
	//{	
	//	typedef itk::ResampleImageFilter<ImageTypeU3, ImageTypeU3 > ResampleFilterType;
	//	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double >  InterpolatorType;
	//	ResampleFilterType::Pointer filter = ResampleFilterType::New();
	//	InterpolatorType::Pointer interpolator2 = InterpolatorType::New();
	//	filter->SetInterpolator(interpolator2);
	//	//filter->SetDefaultPixelValue(255);
	//	filter->SetOutputOrigin(targetImage->GetOrigin());
	//	filter->SetOutputSpacing(targetImage->GetSpacing());
	//	filter->SetOutputDirection(targetImage->GetDirection());
	//	filter->SetSize(targetImage->GetLargestPossibleRegion().GetSize());
	//	// Software Guide : EndCodeSnippet
	//	filter->SetInput(selectedReference);
	//	filter->SetTransform(compositeTransform);
	//	filter->Update();
	//	ImageTypeU3::Pointer movingAffine = filter->GetOutput();
	//	saveImage<ImageTypeU3>(movingAffine, "registeredAffine.mhd");
	//}

	// Now do the b spline deformable matching. Iniitialize it with the selected composite transform
	float deformMetric;
	DeformableTransformType::Pointer bsplineTx = deformableRegistration(targetImage, selectedReference, deformMetric, compositeTransform);
	cout << "out deform metric " << deformMetric << endl;

	referenceImage = NULL;
	selectedReference = NULL;
	//refMask = NULL;

	// save the resulting matched image if you like
	//ImageTypeU3::Pointer registered;
	//try
	//{
	//	typedef itk::ResampleImageFilter<ImageTypeU3, ImageTypeU3 > ResampleFilterType;
	//	typedef itk::LinearInterpolateImageFunction<ImageTypeU3, double >  InterpolatorType;
	//	ResampleFilterType::Pointer resample = ResampleFilterType::New();
	//	InterpolatorType::Pointer interpolator2 = InterpolatorType::New();
	//	resample->SetInterpolator(interpolator2);
	//	//if (deformMetric < compositeMetric)
	//		resample->SetTransform(bsplineTx);
	//	//else
	//		//resample->SetTransform(compositeTransform);
	//	resample->SetInput(referenceImage);
	//	resample->SetSize(targetImage->GetLargestPossibleRegion().GetSize());
	//	resample->SetOutputOrigin(targetImage->GetOrigin());
	//	resample->SetOutputSpacing(targetImage->GetSpacing());
	//	resample->SetOutputDirection(targetImage->GetDirection());
	//	resample->SetDefaultPixelValue(0);
	//	resample->Update();
	//	registered = resample->GetOutput();
	//	saveImage<ImageTypeU3>(registered, "registeredCoarse.mhd");
	//}
	//catch (itk::ExceptionObject & err)
	//{
	//	std::cerr << "ExceptionObject caught ..." << std::endl;
	//	std::cerr << err << std::endl;
	//}

	// the final metric value is the sum of metrics resulting at the end of affine and bspline transformation
	metricValue = deformMetric + compositeMetric;


	// Once registration is finished, this means that we know the transformation between the physical space of the target with the physical
	// space of the reference. THen we simply transform the reference segmentation from reference to our target.
	typedef itk::ResampleImageFilter<MaskImageType3D, MaskImageType3D> ResampleSegmentationFilterType;
	typedef itk::NearestNeighborInterpolateImageFunction<MaskImageType3D, double >  InterpolatorType;

	MaskImageType3D::Pointer targetSegmentationMask = transformImage(referenceSegmentationROI, targetImage, bsplineTx, NULL);
	MaskImageType3D::Pointer targetSegmentation;
	referenceSegmentationROI = NULL;

	if (isCT)
		targetSegmentation = thresholdImageWithMaskCT(targetImage, targetSegmentationMask);//
	else
		targetSegmentation = thresholdImageWithMaskMRI(targetImage, targetSegmentationMask);//

	ImageTypeU3::Pointer  targetSegmentationNew = getLargestConnectedRegion(targetSegmentation, 4);

	surfaces.push_back(laplacianSmooth(createSurface(targetSegmentationNew), 0.05, 200));

	targetSegmentationMask = NULL;
	targetSegmentation = NULL;
	/*
	MaskImageType3D::Pointer targetEntranceMask = transformImage(refEntranceMask, targetImage, bsplineTx, targetSegmentationNew);
	vtkSmartPointer<vtkPolyData> targetEntranceSurface = createSurface(targetEntranceMask);
	targetEntranceMask = NULL;

	MaskImageType3D::Pointer targetNasopharynxMask = transformImage(refNasopharynxMask, targetImage, bsplineTx, targetSegmentationNew);
	vtkSmartPointer<vtkPolyData> targetNasopharynxSurface = createSurface(targetNasopharynxMask);
	targetNasopharynxMask = NULL;
	*/

	ImageTypeU3::PointType pt;
	ImageTypeU3::PointType originTarget = targetImage->GetOrigin();
	ImageTypeU3::IndexType ind;
	ind[0] = targetImage->GetLargestPossibleRegion().GetSize()[0];
	ind[1] = targetImage->GetLargestPossibleRegion().GetSize()[1];
	ind[2] = targetImage->GetLargestPossibleRegion().GetSize()[2];
	targetImage->TransformIndexToPhysicalPoint(ind, pt);
	if (originTarget[0] < pt[0])
		originTarget[0] = originTarget[0] - 5;
	else
		originTarget[0] = originTarget[0] + 5;
	if (originTarget[1] < pt[1])
		originTarget[1] = originTarget[1] - 5;
	else
		originTarget[1] = originTarget[1] + 5;
	if (originTarget[2] < pt[2])
		originTarget[2] = originTarget[2] - 5;
	else
		originTarget[2] = originTarget[2] + 5;
	ImageTypeU3::SizeType newSize;
	newSize[0] = targetImage->GetLargestPossibleRegion().GetSize()[0] + 30;
	newSize[1] = targetImage->GetLargestPossibleRegion().GetSize()[1] + 30;
	newSize[2] = targetImage->GetLargestPossibleRegion().GetSize()[2] + 30;

	ImageTypeU3::Pointer  targetSegmentationNewResampled;
	{
		InterpolatorType::Pointer interpolator3 = InterpolatorType::New();
		ResampleSegmentationFilterType::Pointer segmentationResampler3 = ResampleSegmentationFilterType::New();
		segmentationResampler3->SetInput(targetSegmentationNew);
		segmentationResampler3->SetSize(newSize);
		segmentationResampler3->SetOutputOrigin(originTarget);
		segmentationResampler3->SetOutputSpacing(targetImage->GetSpacing());
		segmentationResampler3->SetOutputDirection(targetImage->GetDirection());
		segmentationResampler3->SetInterpolator(interpolator3);
		segmentationResampler3->UpdateLargestPossibleRegion();
		targetSegmentationNewResampled = segmentationResampler3->GetOutput();
	}
	targetSegmentationNew = NULL;
	targetImage = NULL;


	MaskImageType3D::Pointer targetCylindersBinary = transformImage(refCylinders, targetSegmentationNewResampled, bsplineTx, NULL);
	refCylinders = NULL;

	MaskImageType3D::Pointer targetCylindersBoundaries = transformImage(refCylindersBoundaries, targetSegmentationNewResampled, bsplineTx, NULL);
	centers = getCylinderCenters(targetCylindersBoundaries);
	targetCylindersBoundaries = NULL;

	//vtkSmartPointer<vtkPolyData> boundarySurface = laplacianSmooth(getSurface(refCylindersBoundaries, targetSegmentationNewResampled, bsplineTx),0.05,200);

	bsplineTx = NULL;

	//saveImage<ImageTypeU3>(targetCylindersBinary, "CYLINDERS.mhd");
	//saveImage<ImageTypeU3>(targetSegmentationNewResampled, "targetSegmentationNewResampled.mhd");
	typedef itk::OrImageFilter <ImageTypeU3>		OrImageFilterType;
	OrImageFilterType::Pointer orFilter = OrImageFilterType::New();
	orFilter->SetInput(0, targetCylindersBinary);
	orFilter->SetInput(1, targetSegmentationNewResampled);
	orFilter->Update();

	typedef itk::BinaryBallStructuringElement<ImageTypeU3::PixelType, 3>  StructuringElementType;
	StructuringElementType structuringElement2;
	structuringElement2.SetRadius(3);
	structuringElement2.CreateStructuringElement();
	typedef itk::BinaryMorphologicalClosingImageFilter <ImageTypeU3, ImageTypeU3, StructuringElementType>	BinaryMorphologicalClosingImageFilterType;
	BinaryMorphologicalClosingImageFilterType::Pointer closingFilter = BinaryMorphologicalClosingImageFilterType::New();
	closingFilter->SetInput(orFilter->GetOutput());
	closingFilter->SetKernel(structuringElement2);
	closingFilter->Update();


	typedef itk::ConstantPadImageFilter <ImageTypeU3, ImageTypeU3>		ConstantPadImageFilterType;
	ImageTypeU3::SizeType lowerExtendRegion;
	lowerExtendRegion[0] = 1;
	lowerExtendRegion[1] = 1;
	lowerExtendRegion[2] = 1;

	ImageTypeU3::SizeType upperExtendRegion;
	upperExtendRegion[0] = 1;
	upperExtendRegion[1] = 1;
	upperExtendRegion[2] = 1;

	ImageTypeU3::PixelType constantPixel = 0;

	ConstantPadImageFilterType::Pointer padFilter = ConstantPadImageFilterType::New();
	padFilter->SetInput(closingFilter->GetOutput());
	//padFilter->SetPadBound(outputRegion); // Calls SetPadLowerBound(region) and SetPadUpperBound(region)
	padFilter->SetPadLowerBound(lowerExtendRegion);
	padFilter->SetPadUpperBound(upperExtendRegion);
	padFilter->SetConstant(constantPixel);
	padFilter->Update();

	//saveImage<ImageTypeU3>(padFilter->GetOutput(), "or.mhd");

	// Now we transform the target segmentation from itk to vtk format
	typedef itk::ImageToVTKImageFilter<MaskImageType3D> ITKtoVTKImageConverterType;
	ITKtoVTKImageConverterType::Pointer ITKtoVTKImageConverterter = ITKtoVTKImageConverterType::New();
	ITKtoVTKImageConverterter->SetInput(padFilter->GetOutput());
	ITKtoVTKImageConverterter->Update();
	vtkSmartPointer<vtkImageData> vtktargetSegmentation = ITKtoVTKImageConverterter->GetOutput();

	// Now we create a 3D surface from individual image points using Marching cubes 
	vtkSmartPointer<vtkDiscreteMarchingCubes> surface = vtkSmartPointer<vtkDiscreteMarchingCubes>::New();
	surface->SetInputData(vtktargetSegmentation);
	//surface->SetLocator
	surface->Update();
	vtkSmartPointer<vtkPolyData> targetSurface = surface->GetOutput();

	// during itk->vtk conversion, the directionality is lost. We now restore the orientation to the the vtk surface by transforming it 
	// according to the original ik direction. 
	MaskImageType3D::DirectionType d = targetSegmentationNewResampled->GetDirection();
	vtkMatrix4x4* dirMat = vtkMatrix4x4::New();
	dirMat->SetElement(0, 0, d(0, 0)); dirMat->SetElement(0, 1, d(0, 1)); dirMat->SetElement(0, 2, d(0, 2)); dirMat->SetElement(0, 3, 0);
	dirMat->SetElement(1, 0, d(1, 0)); dirMat->SetElement(1, 1, d(1, 1)); dirMat->SetElement(1, 2, d(1, 2)); dirMat->SetElement(1, 3, 0);
	dirMat->SetElement(2, 0, d(2, 0)); dirMat->SetElement(2, 1, d(2, 1)); dirMat->SetElement(2, 2, d(2, 2)); dirMat->SetElement(2, 3, 0);
	dirMat->SetElement(3, 0, 0); dirMat->SetElement(3, 1, 0); dirMat->SetElement(3, 2, 0); dirMat->SetElement(3, 3, 1);
	vtkSmartPointer<vtkTransform> vtkDir = vtkSmartPointer<vtkTransform>::New();
	vtkDir->SetMatrix(dirMat);
	vtkSmartPointer<vtkTransform> vtkTx = vtkSmartPointer<vtkTransform>::New();
	vtkTx->Translate(targetSegmentationNewResampled->GetOrigin()[0], targetSegmentationNewResampled->GetOrigin()[1], targetSegmentationNewResampled->GetOrigin()[2]);
	vtkTx->Concatenate(vtkDir);
	vtkTx->Translate(-targetSegmentationNewResampled->GetOrigin()[0], -targetSegmentationNewResampled->GetOrigin()[1], -targetSegmentationNewResampled->GetOrigin()[2]);
	vtkTx->Update();
	vtkSmartPointer<vtkTransformPolyDataFilter> transformFilter = vtkSmartPointer<vtkTransformPolyDataFilter>::New();
	transformFilter->SetInputData(targetSurface);
	transformFilter->SetTransform(vtkTx);
	transformFilter->Update();
	vtkSmartPointer<vtkPolyData> targetSurfaceNew = laplacianSmooth(transformFilter->GetOutput(), 0.05, 200);



	////Append the two meshes 
	//vtkSmartPointer<vtkAppendPolyData> appendFilter =	vtkSmartPointer<vtkAppendPolyData>::New();
	//appendFilter->AddInputData(targetSurfaceNew);
	//appendFilter->AddInputData(boundarySurface);
	////appendFilter->AddInputData(targetRightNoseCylinder);
	////appendFilter->AddInputData(targetNasopharynxCylinder);
	//appendFilter->Update();

	//// Remove any duplicate points.
	//vtkSmartPointer<vtkCleanPolyData> cleanFilter =	vtkSmartPointer<vtkCleanPolyData>::New();
	//cleanFilter->SetInputData(appendFilter->GetOutput());
	//cleanFilter->Update();

	//surfaces.push_back(cleanFilter->GetOutput());
	//surfaces.push_back(laplacianSmooth(targetEntranceSurface, 0.05, 200));
	//surfaces.push_back(laplacianSmooth(targetNasopharynxSurface, 0.05, 200));
	surfaces.push_back(targetSurfaceNew);

	return surfaces;
}