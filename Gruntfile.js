"use strict";

module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    clean: {
      build: ["build"]
    },

    csso: {
      style: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style.min.css": ["build/css/style.css"]
        }
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'source',
          src: [
            "fonts/**/*.{woff,woff2}",
            "img/**",
            "js/**"
          ],
          dest: "build"
        }]
      }
    },

    cwebp: {
      images: {
        options: {
          q: 90
        },
        files: [{
          expand: true,
          cwd: "build",
          src: ["img/**/*.{png,jpg}"],
          dest: "build"
        }]
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: ["img/**/*.{png,jpg,svg}"],
          dest: "build"
        }]
      }
    },

    svgstore: {
      options: {
        includeTitleElement: false
      },
      sprite: {
        files: {
          "build/img/sprite.svg": ["build/img/icon-*.svg"]
        }
      }
    },

    sass: {
      style: {
        files: {
          "build/css/style.css": "source/sass/style.scss"
        }
      }
    },

    postcss: {
      style: {
        options: {
          processors: [
            require("autoprefixer")({browsers: ['IE 11', 'last 5 versions']})
          ]
        },
        src: "build/css/*.css"
      }
    },

    posthtml: {
      options: {
        use: [
          require('posthtml-include')()
        ]
      },
      html: {
        files: [{
          expand: true,
          cwd: 'source/',
          src: ["*.html"],
          dest: "build"
        }]
      }
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            "build/*.html",
            "build/css/*.css"
          ]
        },
        options: {
          server: "build/",
          watchTask: true,
          notify: false,
          open: true,
          cors: true,
          ui: false
        }
      }
    },

    watch: {
      html: {
        files: ["source/*.html"],
        tasks: ["posthtml"]
      },
      style: {
        files: ["source/sass/**/*.{scss,sass}"],
        tasks: ["sass", "postcss", "csso"]
      }
    }
  });

  grunt.registerTask("serve", ["browserSync", "watch"]);

  grunt.registerTask("build", [
    "clean",
    "copy",
    "sass",
    "postcss",
    "csso",
    "imagemin",
    "cwebp",
    "svgstore",
    "posthtml"
  ]);
};
