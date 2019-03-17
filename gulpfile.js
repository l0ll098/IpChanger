const gulp = require("gulp");
const ts = require("gulp-typescript");
const exec = require("gulp-exec");
const del = require("del");
const serverProject = ts.createProject("tsconfig.json");

const DIST_FOLDER = "./dist/";


const Tasks = Object.freeze({
    BuildServer: "BuildServer",
    CopyPackageJson: "CopyPackageJson",
    CopyPackageLockJson: "CopyPackageLockJson",
    CopyIcon: "CopyIcon",

    BuildClient: "BuildClient",
    CopyClientDist: "CopyClientDist",

    InstallDependenciesDist: "InstallDependenciesDist",
    Package_Win_x64: "Package",

    BuildAndCopyFiles: "BuildAndCopyFiles",
    Clean: "Clean",
    RemoveLocales: "RemoveLocales"
});


/**
 * Compile server code
 */
gulp.task(Tasks.BuildServer, () => {
    return serverProject
        .src()
        .pipe(serverProject())
        .js.pipe(gulp.dest(DIST_FOLDER));
});

/**
 * Copy package.json and package-lock.json to the dist folder
 */
gulp.task(Tasks.CopyPackageJson, () => {
    return gulp
        .src("./package.json")
        .pipe(gulp.dest(DIST_FOLDER));
});

gulp.task(Tasks.CopyPackageLockJson, () => {
    return gulp.src("./package-lock.json")
        .pipe(gulp.dest(DIST_FOLDER));
});

gulp.task(Tasks.CopyIcon, () => {
    return gulp.src("./icon.ico")
        .pipe(gulp.dest(DIST_FOLDER));
});

/**
 * Builds the client side (using Angular CLI)
 */
gulp.task(Tasks.BuildClient, () => {
    return gulp
        .src("./client/")
        .pipe(exec("npm run build:prod", {
            cwd: "./client/"
        }));
});

/**
 * Copies the compiled client dist folder in the server one
 */
gulp.task(Tasks.CopyClientDist, () => {
    return gulp.src("client/dist/**/*")
        .pipe(gulp.dest(DIST_FOLDER + "client/"));
});

/**
 * Installs dependencies in the dist folder
 */
gulp.task(Tasks.InstallDependenciesDist, () => {
    return gulp.src(DIST_FOLDER)
        .pipe(exec("npm install", {
            cwd: DIST_FOLDER
        }));
});

/**
 * Package app for win x64
 */
gulp.task(Tasks.Package_Win_x64, () => {
    return gulp.src(DIST_FOLDER)
        .pipe(exec("npm run package_win_x64", {
            cwd: DIST_FOLDER
        }));
});

gulp.task(Tasks.Clean, () => {
    return del([
        "dist/**",
        "bin/**",
        "client/dist/**"
    ]);
});

/**
 * Remove unused locales.
 * Keep only [en-GB.pak, en-US.pak, it.pak]
 */
gulp.task(Tasks.RemoveLocales, () => {
    return del("locales/!(en-GB|en-US|it)*.pak", {
        cwd: "dist/bin/ipchanger-win32-x64"
    });
});

/**
 * Run all
 */
gulp.task(Tasks.BuildAndCopyFiles, (done) => {
    return gulp.series(
        Tasks.Clean,
        Tasks.BuildServer,
        Tasks.BuildClient,
        Tasks.CopyClientDist,
        gulp.parallel(
            Tasks.CopyPackageJson,
            Tasks.CopyPackageLockJson,
            Tasks.CopyIcon
        )
    )(done);
});

gulp.task("default", (done) => {
    return gulp.series(
        Tasks.BuildAndCopyFiles,
        Tasks.InstallDependenciesDist,
        gulp.parallel(
            Tasks.Package_Win_x64
        ),
        Tasks.RemoveLocales
    )(done);
});
