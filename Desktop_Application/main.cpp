#pragma once

#include <QApplication>
#include <QMainWindow>

#include <QSettings>
#include <QFile>
#include <QIODevice>
#include <QDataStream>
#include <QCompleter>
#include <QFileSystemModel> 
#include <QMenuBar>
#include <QMessageBox>
#include <algorithm>
#include <QProgressDialog>
#include <QToolBar>
#include <QGroupBox>
#include <QPushButton>
#include <QTimer>

#include "QTWidget.h"

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);

	if (argc == 2)
	{
		QTWidget* w = new QTWidget(QString(argv[1]));
		w->showMaximized();
	}
	else if (argc == 3)
	{
		QTWidget* w = new QTWidget(QString(argv[1]), QString(argv[2]));
		w->showMaximized();
	}
	else if (argc == 4)
	{
		QTWidget* w = new QTWidget(QString(argv[1]), QString(argv[2]), QString(argv[3]));
		w->showMaximized();
	}
	else if (argc == 5)
	{
		QTWidget* w = new QTWidget(QString(argv[1]), QString(argv[2]), QString(argv[3]), QString(argv[4]));
		w->showMaximized();
	}
	else if (argc == 6)
	{
		QTWidget* w = new QTWidget(QString(argv[1]), QString(argv[2]), QString(argv[3]), QString(argv[4]), QString(argv[5]));
		w->showMaximized();
	}
	else
	{
		QTWidget* w = new QTWidget();
		w->showMaximized();
	}

	return a.exec();

}