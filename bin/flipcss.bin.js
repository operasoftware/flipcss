#!/usr/bin/env node

var flipcss = require('../lib/flipcss');
var fs = require('fs');

/**
 * Handle command line arguments
 * @param {Array} argv Command line arguments (with commands stripped off)
 * @throws {InvalidArgumentsError} If invalid argument(s)
 * @returns {Object} with options, or null.
 */
function handleArgv(argv) {
    // Usage info
    var usage = ["Usage: node flipcss [OPTION] ... INFILE OUTFILE",
                 "  -r, --rtl              Flip CSS LTR>RTL",
                 "  -l, --ltr              Flip CSS RTL>LTR",
                 "  -w, --warnings         Output warnings",
                 "  -h, --help             Usage information",
                 "  -c, --clean-only       Clean only (requires a direction, -r or -l)",
                 "  -p, --swap-pseudo      Swap :before and :after",
                 "  -u, --ignore-urls      Do not swap the words left and right inside url()",
                 "  -s, --ignore-selectors Do not swap the words left and right in selectors",
                 "If no direction is given, the CSS is just flipped (with no cleaning of direction specific rules)."
                ].join("\n");

    // Asked for help
    if (argv[0] === "-h" || argv[0] === "--help") {
        console.log(usage.toString());
        return null;
    }

    // Vars
    var direction = "none";
    var warnings = false;
    var cleanOnly = false;
    var swapPseudo = false;
    var flipUrls = true;
    var flipSelectors = true;
    var validArgs = {
        "-r": "rtl",
        "--rtl": "rtl",
        "-l": "ltr",
        "--ltr": "ltr",
        "-w": "warnings",
        "--warnings": "warnings",
        "-c": "cleanonly",
        "--clean-only": "cleanonly",
        "-p": "swappseudo",
        "--swap-pseudo": "swappseudo",
        "-u": "ignoreurls",
        "--ignore-urls": "ignoreurls",
        "-s": "ignoreselectors",
        "--ignore-selectors": "ignoreselectors"
    };
    var optCount = 0;

    // Process args
    for (var arg in validArgs) {
        if(validArgs.hasOwnProperty(arg)) {
            var i = argv.indexOf(arg);
            if (-1 < i) {
                optCount++;

                argv.splice(i,1);

                switch (validArgs[arg]) {
                case 'rtl':
                    direction = "rtl";
                    break;
                case 'ltr':
                    direction = "ltr";
                    break;
                case 'warnings':
                    warnings = true;
                    break;
                case 'cleanonly':
                    cleanOnly = true;
                    break;
                case 'swappseudo':
                    swapPseudo = true;
                    break;
                case 'ignoreurls':
                    flipUrls = false;
                    break;
                case 'ignoreselectors':
                    flipSelectors = false;
                    break;
                }
            }
        }
    }

    // Invalid arguments
    if (2 < optCount ||
        argv.length !== 2 ||
        (cleanOnly && direction === "none"))
    {
        throw { name: "InvalidArgumentsError",
                message: "Invalid option(s).\n" + usage.toString() };
    }

    return {
        direction: direction,
        warnings: warnings,
        cleanOnly: cleanOnly,
        swapPseudo: swapPseudo,
        flipUrls: flipUrls,
        flipSelectors: flipSelectors,
        input: argv[0],
        output: argv[1]
    };
}


/**
 * Transform CSS from LTR>RTL or vice versa.
 * @param {String} css CSS to transform
 * @param {String} direction Direction ("ltr", "rtl", or empty/"none")
 * @param {Boolean} warnings Output warnings
 * @param {Boolean} swapPseudo Swap :before and :after
 * @param {Boolean} flipUrl flip words "left" and "right" inside url()
 * @param {Boolean} flipSelectors flip words "left" and "right" in selectors
 * @return {String} Processed CSS
 */
function transform(css, direction, warnings, cleanOnly,
                   swapPseudo, flipUrls, flipSelectors) {
    if (direction === "ltr" || direction === "rtl") {
        css = flipcss.clean(css, direction);
    }

    if (!cleanOnly) {
        return flipcss.flip(css, warnings, swapPseudo,
                            flipUrls, flipSelectors);
    } else {
        return css;
    }
}

/**
 * Main.
 */
function main() {
    var res;
    try {
        res = handleArgv(process.argv.slice(2));
        if (!res) {
            process.exit(0);
        }
    } catch (err) {
        console.log(err.message);
        process.exit(2);
    }

    var infileName = res.input;
    var outfileName = res.output;

    fs.readFile(infileName, "utf-8", function (err, data) {
        if (err) {
            console.log(err.message);
            process.exit(1);
        }

        var outfile = fs.openSync(outfileName, "w");

        var outdata = transform(data, res.direction, res.warnings,
                                res.cleanOnly, res.swapPseudo, res.flipUrls,
                                res.flipSelectors);

        fs.write(outfile, outdata, function (err, written, string) {
          if (err) {
            console.log(err.message);
            process.exit(1);
          }
        });
      fs.close(outfile, function (err) {
        if (err) {
          console.log(err.message);
          process.exit(1);
        }
      });
    });
}


if (require.main === module) {
    main();
} else {
    module.exports = {handleArgv: handleArgv,
                      transform: transform};
}
