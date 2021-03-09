PROJECT(ImageViewer)

CMAKE_MINIMUM_REQUIRED(VERSION 2.6)

IF(COMMAND CMAKE_POLICY)
	   CMAKE_POLICY(SET CMP0003 NEW)
ENDIF(COMMAND CMAKE_POLICY)

FIND_PACKAGE(ITK)
IF(ITK_FOUND)
	INCLUDE(${ITK_USE_FILE})
ELSE(ITK_FOUND)
	MESSAGE(FATAL_ERROR "Cannot build InsightApplications without ITK.  Please set ITK_DIR.")
ENDIF(ITK_FOUND)

FIND_PACKAGE (VTK)
  
IF (VTK_FOUND)
   INCLUDE(${VTK_USE_FILE})
ELSE(VTK_FOUND)
	MESSAGE(FATAL_ERROR "Cannot build VTK.  Please set VTK_DIR.")
ENDIF(VTK_FOUND)

# Find includes in corresponding build directories
set(CMAKE_INCLUDE_CURRENT_DIR ON)
# Instruct CMake to run moc automatically when needed.
set(CMAKE_AUTOMOC ON)
find_package(Qt5 COMPONENTS Core Widgets Gui Designer REQUIRED )
#if (QT5_FOUND AND QT5_CORE_FOUND AND QT5_GUI_FOUND AND QT5_DESIGNER_FOUND)
set(QT_USE_QTDESIGNER TRUE)
# INCLUDE(${QT_USE_FILE})
# else()
    # message(FATAL_ERROR "no qt...")
# endif()


  
# FIND_PACKAGE(Qt4 REQUIRED)
# INCLUDE( ${QT_USE_FILE} )

# find_package(VTK REQUIRED)
# include(${VTK_USE_FILE})

#if(${VTK_VERSION} VERSION_GREATER "6" AND VTK_QT_VERSION VERSION_GREATER "4")
  # Instruct CMake to run moc automatically when needed.
  #set(CMAKE_AUTOMOC ON)
  #find_package(Qt5 REQUIRED COMPONENTS Widgets Core)
  #include(${QT_USE_FILE})
#else()
 # find_package(Qt4 REQUIRED)
 # include(${QT_USE_FILE})
#endif()


  
include_directories(${CMAKE_CURRENT_SOURCE_DIR})
 
#SET(ImageViewerSrcs imageWidget.cpp renderWidget.cpp main.cpp QTWidget.cpp registration.cpp)
    
#SET(ImageViewerHeaders imageWidget.h renderWidget.h QTWidget.h registration.h)
    
#QT5_WRAP_CPP(MOCSrcs ${ImageViewerHeaders} )
  
#ADD_EXECUTABLE(ImageViewer ${ImageViewerSrcs} ${ImageViewerHeaders} ${MOCSrcs})

# TARGET_LINK_LIBRARIES(ImageViewer ${QT_LIBRARIES} ${VTK_LIBRARIES} ${ITK_LIBRARIES})

#file(GLOB UI_FILES *.ui)
#file(GLOB QT_WRAP *.h)
#file(GLOB CXX_FILES *.cxx)

#if(${VTK_VERSION} VERSION_GREATER "6" AND VTK_QT_VERSION VERSION_GREATER "4")
 # qt5_wrap_ui(UISrcs ${UI_FILES} )
  #QT5_WRAP_CPP(MOCSrcs ${QT_WRAP})
  # CMAKE_AUTOMOC in ON so the MOC headers will be automatically wrapped.
  #add_executable(ImageViewer ${CXX_FILES} ${QT_WRAP} ${MOCSrcs})
  #target_link_libraries(ImageViewer ${VTK_LIBRARIES} ${ITK_LIBRARIES})
#else()
 # QT4_WRAP_UI(UISrcs ${UI_FILES})
 # QT4_WRAP_CPP(MOCSrcs ${QT_WRAP})
 # add_executable(ImageViewer  MACOSX_BUNDLE ${CXX_FILES} ${UISrcs} ${MOCSrcs})
 # target_link_libraries(ImageViewer  ${QT_LIBRARIES} ${VTK_LIBRARIES} ${ITK_LIBRARIES})
#endif()

  
# Set your files and resources here
SET(ImageViewerSrcs imageWidget.cpp renderWidget.cpp main.cpp QTWidget.cpp registration.cpp)
    
SET(ImageViewerHeaders imageWidget.h renderWidget.h QTWidget.h registration.h)
    
# QT5_WRAP_CPP(MOCSrcs ${ImageViewerHeaders} )
  
ADD_EXECUTABLE(ImageViewer ${ImageViewerSrcs} ${ImageViewerHeaders})

qt5_use_modules(ImageViewer Core Gui Widgets Designer OpenGL OpenGLExtensions)

TARGET_LINK_LIBRARIES(ImageViewer ${QT_LIBRARIES} ${VTK_LIBRARIES} ${ITK_LIBRARIES})
