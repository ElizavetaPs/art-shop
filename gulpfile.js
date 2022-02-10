let project_folder = "dist";
let source_folder = "src";

let fs = require('fs');

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/"
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/index.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    // img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
    fonts: source_folder + "/fonts/*.ttf"
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    // img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)"

  },
  clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browsersync = require('browser-sync').create();
let fileinclude = require('gulp-file-include');
let del = require('del');
let scss = require('gulp-sass')(require('sass'));
let autoprefixer = require('gulp-autoprefixer');
let groupMedia = require('gulp-group-css-media-queries');
let cleanCss = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
let babel = require('gulp-babel');
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let webphtml = require('gulp-webp-html');
let webpcss = require('gulp-webpcss');
let svgSprite = require('gulp-svg-sprite');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}

function html() {
  return src(path.src.html)
  .pipe(fileinclude())
  // .pipe(webphtml())
  .pipe(dest(path.build.html))
  .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
  .pipe(
    scss({
      outputStyle: 'expanded'
    }).on('error', scss.logError)
  )
  .pipe(groupMedia())
  .pipe(
    autoprefixer({
      overrideBrowserlist: ["last 5 versions"],
      cascade: true
    })
  )
  .pipe(webpcss())
  .pipe(dest(path.build.css))
  .pipe(cleanCss())
  .pipe(
    rename({
      extname: ".min.css"
    })
  )
  .pipe(dest(path.build.css))
  .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
  .pipe(fileinclude())
  .pipe(
    babel({
      presets: ['@babel/preset-env']
    })
  )
  .pipe(uglify())
  .pipe(
    rename({
      suffix: ".min",
      extname: ".js"
    })
  )
  .pipe(dest(path.build.js))
  .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
  // .pipe(
  //   imagemin([
  //     imagemin.gifsicle({interlaced: true}),
  //     imagemin.mozjpeg({quality: 75, progressive: true}),
  //     imagemin.optipng({optimizationLevel: 3}),
  //     imagemin.svgo({
  //       plugins: [
  //         {removeViewBox: false}
  //       ]
  //     })
  //   ])
  // )
  // .pipe(webp({
  //     quality: 70
  //   })
  // )
  .pipe(dest(path.build.img))
  .pipe(browsersync.stream());
}

function fonts(params) {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
}

gulp.task('svgSprite', function() {
  return gulp.src([source_folder + '/iconsprite/*.svg'])
  .pipe(
    svgSprite({
      mode: {
        stack: {
          sprite: "../icons/icons.svg",
          example: true
        }
      }
    })
  )
  .pipe(dest(path.build.img))
})

function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + '/scss/fonts.scss', '@include font("'
              + fontname + '", "'
              + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
}

function cb() {

}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.build = build;
exports.watch = watch;
exports.default = watch;
