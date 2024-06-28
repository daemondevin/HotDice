/**
 * Performs variable substitution in a template string.
 * The template string can contain placeholders in the format '{{ path.to.property }}',
 * which are replaced with corresponding values from the provided data object.
 *
 * @param {string} template - The template string containing placeholders.
 * @param {Object} data - The data object containing values to substitute into the template.
 * @returns {string} - The modified template string with placeholders replaced by actual values.
 * @throws {string} - Throws an error if a placeholder in the template does not match any property in the data object.
 *
 * @example
 * // Example usage:
 * var template = "Hello, {{ user.name }}! Your balance is {{ user.balance }}.";
 * var data = {
 *     user: {
 *         name: "John Doe",
 *         balance: 100
 *     }
 * };
 * var result = swap(template, data);
 * // result is "Hello, John Doe! Your balance is 100."
 */
export const swap = (function(){
    "use strict";

    var start   = "{{",
        end     = "}}",
        path    = "[a-z0-9_$][\\.a-z0-9_]*", // e.g. config.person.name
        pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
        undef;
    
    return function(template, data){
        // Merge data into the template string
        return template.replace(pattern, function(tag, token){
            var path = token.split("."),
                len = path.length,
                lookup = data,
                i = 0;

            for (; i < len; i++){
                lookup = lookup[path[i]];
                
                // Property not found
                if (lookup === undef){
                    throw "swap: '" + path[i] + "' not found in " + tag;
                }
                
                // Return the required value
                if (i === len - 1){
                    return lookup;
                }
            }
        });
    };
}());

/**
 * Converts a given time to a human-readable relative time string.
 * The string indicates how long ago or how far in the future the given time is from the current time.
 *
 * @param {string} time - The time to convert, in a format parsable by `Date.parse()`.
 * @returns {string} - A human-readable string representing the relative time difference.
 *
 * @example
 * // Example usage:
 * const timeStr = "2023-06-20T12:00:00Z";
 * const result = timeToWords(timeStr);
 * // result might be "about an hour ago" or "about an hour from now" depending on the current time
 */
export const timeToWords = function(time) {
    let syntax = {
        postfixes: {
            '<': ' ago',
            '>': ' from now'
        },
        1000: {
            singular: 'a few moments',
            plural: 'a few moments'
        },
        60000: {
            singular: 'about a minute',
            plural: '# minutes'
        },
        3600000: {
            singular: 'about an hour',
            plural: '# hours'
        },
        86400000: {
            singular: 'a day',
            plural: '# days'
        },
        31540000000: {
            singular: 'a year',
            plural: '# years'
        }
    };

    var timespans = [1000, 60000, 3600000, 86400000, 31540000000];
    var parsedTime = Date.parse(time.replace(/\-00:?00$/, ''));

    if (parsedTime && Date.now) {
        var timeAgo = parsedTime - Date.now();
        var diff = Math.abs(timeAgo);
        var postfix = syntax.postfixes[(timeAgo < 0) ? '<' : '>'];
        var timespan = timespans[0];

        for (var i = 1; i < timespans.length; i++) {
            if (diff > timespans[i]) {
                timespan = timespans[i];
            }
        }

        var n = Math.round(diff / timespan);

        return syntax[timespan][n > 1 ? 'plural' : 'singular']
            .replace('#', n) + postfix;
    }
}

/**
 * Generates a current timestamp string in the format 'YYYY-MM-DDTHH:MM:SS'.
 * This format is commonly used in date-time representations and is suitable for many use cases.
 *
 * @returns {string} - A string representing the current timestamp.
 *
 * @example
 * // Example usage:
 * const timestamp = getCurrentTimestamp();
 * // timestamp might be "2024-06-20T15:45:30"
 */
export const getCurrentTimestamp = function() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

