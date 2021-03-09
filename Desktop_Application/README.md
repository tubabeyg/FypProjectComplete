# README #


### Desktop Application ###

How do I get set up?

This code is tested on 64 bit platform in Release mode and using following libs,

-	CMAKE 3.9.6

-	Visual Studio 2015

-	QT 5.6.3 available at https://download.qt.io/official_releases/qt/5.6/5.6.3/. Download qt-opensource-windows-x86-msvc2015_64-5.6.3

-	ITK 4.10.1

-	VTK 8.0.1

1.	Install Visual Studio 2015, Restart Computer.

2.	Install CMAKE 3.9.6.

3.	Install QT 5.6.3. 
	1.  Open Environment Variables and under system variables, create a new variable entitled "QT_DIR" and set its value as C:\Qt\Qt5.6.3\5.6.3\msvc2015_64. 
	
	2.  Now open Path and add %QT_DIR%\bin at TOP of the path. 
	
	3.  Restart Computer.

4.	Download VTK 8.0.1 source from vtk.org.
	
	1.	-	Build vtk from the source using Cmake. Open CMake, specify the directory where vtk source has been downloaded (It should contain a file named CMakeLists.txt). 
	
	2.	-	Likewise specify the destination Build folder in Cmake. Click on Configure Button and specify visual studio 2015 64 bit as target compiler. Click Configure.
	
	3.	-	Specific Variables: (accessed by checking "Advanced" checkbox in Cmake)
	
	4.	-	Search for "qt" in the search tab and check all modules and plugins that use qt including Module_vtkGUISupportQT, VTK_BUILD_QT_DESIGNER_PLUGIN etc.
	
	5.	-	Under QT_QMAKE_EXECUTABLE specify where the file qmake.exe is located (C:/Qt/Qt5.6.3/5.6.3/msvc2015_64/bin/qmake.exe)
	
	6.	-	Specify "5" as the qt version in VTK_QT_VERSION.
	
	7.	-	Change VTK_RENDERING_BACKEND from OPENGL2 to OPENGL.
	
	8.	-	Once successfully configured, click on generate button.	After generation, go to Build folder and open VTK.sln. Go to Release mode and build the solution.
	
	9.	-	Open System Environment Variables and add "/VTK-8.0.1/Build/bin/Release" in path variable (be sure that this is the correct path where .dll files are located). Restart Computer.
	
	10. -   Note: The image viewer needs the original folder where VTK was unpacked for automatic referencing of libraries. Do not delete.
	
5. Download ITK 4.10.1 source from itk.org.

	1.	-	Like vtk, also build itk from the source by specifying source and target directories and visual studio 2015 64 bit as target compiler.
	
	2.	-	Specific Variables: (accessed by checking "Advanced" checkbox in Cmake)
	
		-	Search for "vtk" in the search tab and check Module_ITKVtk Glue. (Click COnfigure)
		
		-	Then specify vtk build folder as VTK_DIR e.g. "/VTK-8.0.1/Build". (This is the root directory of VTK Build, not bin). Click Configure and generate.

		-	After generation, go to Build folder and open ITK.sln. Go to Release mode and build the solution.

6. Now is the time to configure our own project.

	-	Open Cmake and specify /repository as the source folder. Similarly specify another folder where the build files are saved.
	
	-	Specify itk and vtk build directories, if needed.
	
	-	Click configure and generate.
	
	-	Open the build fodler of the project and run ImageViewer.sln in the release mode.


### Algorithm Description ###

Therefore the idea is to do intensity based thresholding only within a certain region of the target image. That certain region is inferred from a reference image where
a segmentation map is already available. The region of interest in target image is identified using image registration which aims to find an appropriate 
transformation between the two images. Once we know the transformation or point wise correspondence from reference to target image, we can easily map the 3d 
segmentation map (that we have obtained manually on reference) from reference to target image. Once the region of interest is identified within the target image, 
the intensity based thresholding is done within that region. The threshold value is determined using first order characteristics of pixels within that region.

The algorithm runs in two modes,

	1.	-	Simple: Here we use 3 step approach:
		
		a	-	Rigid Transformation: This aligns the two images in rigid manner.
		
		b.	-	Affine Transformation: Initialized by rigid transformation found in above step, this align the two images in affine manner.
		
		c.	-	B-spline Transformation: Initialized by affine transformation, we then use cubic b spline deformation field to align the two images.
		
	2.	-	Complex:
		
		a.	-	Translation Transformation: This estimates the translation between two images.
		
		b.	-	Rigid Transformation: Initialized by translation found in above step, this aligns the two images in rigid manner.
		
		c.	-	Affine Transformation: Initialized by rigid transformation found in above step, this align the two images in affine manner.
		
		d.	-	B-spline Transformation: Initialized by affine transformation, we then use cubic b spline deformation field to align the two images.
		
		These 4 processes are repeated by flipping each axes separately in order to take care for inconsistent image acqisition protocols.