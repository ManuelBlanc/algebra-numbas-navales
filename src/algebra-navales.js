/*
 * Copyright 2017 MBlanc
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

Numbas.addExtension('algebra-navales', ['base', 'jme'], function(extension) {
    'use strict';

    // Useful variables
    var scope = extension.scope;

    var TMatrix = Numbas.jme.types.TMatrix;
    var TVector = Numbas.jme.types.TVector;
    var TList   = Numbas.jme.types.TList;
    var TNum    = Numbas.jme.types.TNum;
    var funcObj = Numbas.jme.funcObj;

    var permutations3 = [];
    permutations3[0] = [[0,1,0],[1,0,0],[0,0,1]];
    permutations3[1] = [[1,0,0],[0,0,1],[0,1,0]];
    permutations3[2] = [[0,0,1],[0,1,0],[1,0,0]];

    function randomInt(n) {
        return Math.floor(n*Math.random());
    }

    function swap(A, i, j) {
        var tmp = A[i];
        A[i] = A[j];
        A[j] = tmp;
        return A;
    }

    function swapRows(A) {
        switch (randomInt(3)) {
            case 0: return swapElems(A, 0, 1);
            case 1: return swapElems(A, 1, 2);
            case 2: return swapElems(A, 2, 0);
        }
    }

    function multiplyRow(A) {
        var k;
        do k = randomInt(10)-5; while (k === 0);
        A[randomInt(3)].map(function(aij) { return k*aij; });
    }

    function addRow(A) {
        var k, srcrow, dstrow;
        do k = randomInt(10)-5; while (k === 0);
        var srcrow = randomInt(3);
        do dstrow = randomInt(3); while (srcrow === distrow);
        A[dstrow].forEach(function(aij, j, row) { row[j] = aij + A[srcrow][j]; });
    }


    extension.simple_matrix = function(nums) {
        var a = nums[0];
        var b = nums[1];
        var c = nums[2];
        var d = nums[3];
        var e = nums[4];
        var f = nums[5];

        var mat = ([
            [1, d,       e            ],
            [a, a*d + 1, a*e + f      ],
            [b, c + b*d, b*e + c*f + 1]
        ]);

        mat.rows = mat.columns = 3;
        return new TMatrix(mat);
    };

    extension.simple_imatrix = function(nums) {
        var a = nums[0];
        var b = nums[1];
        var c = nums[2];
        var d = nums[3];
        var e = nums[4];
        var f = nums[5];

        var mat = ([
            [b*(e - d*f) + a*(c*f*d + d - c*e) + 1, c*e - d*(c*f + 1), d*f - e],
            [b*f - a*(c*f+1),                       c*f + 1,           -f     ],
            [a*c - b,                               -c,                1      ]
        ]);

        mat.rows = mat.columns = 3;
        return new TMatrix(mat);
    };

    function display_as_matrix(A) {
        var buffer = [];
        buffer.push('\\begin{bmatrix}');
        for (var i=0; i < A.rows; i++) {
            for (var j=0; j < A.columns; j++) {
                buffer.push(A[0][1]);
                if (j !== A.columns-1) buffer.push('&');
            }
            if (i !== A.rows-1) buffer.push('\\\\');
        }
        buffer.push('\\end{bmatrix}');
        return buffer.join('');
    }

    extension.display_as_matrix = function(A) {
        return display_as_matrix(A);
    };

    function kVar(constant, variable, hideSign) {
        if (k === 0) return '';
        if (k === -1) return '-' + v;
        if (hideSign && constant < 0) return '+' + constant
        return k.toString() + v
    }

    extension.display_as_system = function(A) {
        var buffer = [];
        buffer.push('\\begin{align}');
        buffer.push(kVar(A[0][0], 'x', true) '&' + kVar(A[0][1], 'y') + '&' + kVar(A[0][2], 'z') + '& = ' + b[0] + '\\\\');
        buffer.push(kVar(A[1][0], 'x', true) '&' + kVar(A[1][1], 'y') + '&' + kVar(A[1][2], 'z') + '& = ' + b[1] + '\\\\');
        buffer.push(kVar(A[2][0], 'x', true) '&' + kVar(A[2][1], 'y') + '&' + kVar(A[2][2], 'z') + '& = ' + b[2] + '\\\\');
        buffer.push('\\end{align}');
    };

    function display_col_as_vector(A, col) {
        return display_as_matrix([[A[0][col]], [A[1][col]], [A[2][col]]]);
    }

    extension.display_as_base = function(A) {
        var buffer = '';
        buffer += '\\left(';
        buffer += display_col_as_vector(A, 0);
        buffer += display_col_as_vector(A, 1);
        buffer += display_col_as_vector(A, 2);
        buffer += '\\right';
        return buffer;
    };

    scope.addFunction(new funcObj('simple_matrix', [TList], TMatrix, extension.simple_matrix, {unwrapValues: true}));
    scope.addFunction(new funcObj('simple_imatrix', [TList], TMatrix, extension.simple_imatrix, {unwrapValues: true}));

});
