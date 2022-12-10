ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "3.2.1"

lazy val root = (project in file("."))
  .settings(
    name := "scala",
    idePackagePrefix := Some("info.sthuck"),
    libraryDependencies ++= Seq("org.specs2" %% "specs2-core" % "5.2.0" % "test")
  )
