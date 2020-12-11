const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("docs/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Sripts

const script = () => {
  return gulp.src("source/js/script.js")
  .pipe(gulp.dest("docs/js"))
  .pipe(sync.stream());
}

exports.script = script;

// HTML

const html = () => {
  return gulp.src("source/*.html")
  .pipe(gulp.dest("docs"))
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'docs'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/script.js", gulp.series("script"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, script, server, watcher
);

// Copy

const copy = () => {
  return gulp.src([
          "source/js/**"
  ], {
      base: "source"
  })
  .pipe(gulp.dest("docs"));
};

exports.copy = copy;

// Clean

const clean = () => {
  return del("docs");
};

exports.clean = clean;

// Build

const build = gulp.series(
      clean,
      copy,
      styles,
      script,
      html
);

exports.build = build;