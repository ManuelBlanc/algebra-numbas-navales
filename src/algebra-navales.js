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

    function randomInt(a, b) {
        switch (arguments.length) {
            case 1: return     Math.floor(   a *Math.random());
            case 2: return a + Math.floor((b-a)*Math.random());
            default: throw new Error("Invalid number of arguments");
        }
    }

    function randomNonZeroInt(n) {
        var r;
        do r = randomInt(n); while (r === 0);
        return r;
    }

    function swap(A, i, j) {
        var tmp = A[i];
        A[i] = A[j];
        A[j] = tmp;
        return A;
    }

    var elementalOps = {};

    elementalOps.swapRows = function(A, i0, i1) {
        if (i0 === i1) return A;
        return swap(A, i0, i1);
    };

    elementalOps.multiplyRowByScalar = function(A, i, k) {
        A[i].forEach(function(aij, j, row) {
            row[j] = k*aij;
        });
        return A;
    }

    elementalOps.addRowMultiplied = function(A, i0, i1, k) {
        if (k === undefined) k = 1;
        A[i0].forEach(function(ai1j, j, row) {
            row[j] = ai1j + k*A[i1][j];
        });
        return A;
    }

    extension.invertible_matrix = function(ops) {
        var A = [[1,0,0], [0,1,0], [0,0,1]];
        while (ops --> 0) {
            switch (randomInt(3)) {

                case 0:
                i0 = randomInt(3);
                i1 = (i0 + randomInt(2)) % 3;
                elementalOps.swapRows(A, i0, i1);
                break;

                case 1:
                i0 = randomInt(3);
                k = randomNonZeroInt(-5, 5);
                elementalOps.multiplyRowByScalar(A, i0, k);
                break;

                case 2:
                i0 = randomInt(3);
                i1 = (i0 + randomInt(2)) % 3;
                k = randomNonZeroInt(-5, 5);
                elementalOps.addRowMultiplied(A, i0, i1, k);
                break;
            }
        }
        return A;
    };


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
        if (hideSign && constant < 0) return '+' + constant;
        return k.toString() + v;
    }

    extension.display_as_system = function(A) {
        var buffer = [];
        buffer.push('\\begin{align}');
        buffer.push(kVar(A[0][0], 'x', true) + '&' + kVar(A[0][1], 'y') + '&' + kVar(A[0][2], 'z') + '& = ' + b[0] + '\\\\');
        buffer.push(kVar(A[1][0], 'x', true) + '&' + kVar(A[1][1], 'y') + '&' + kVar(A[1][2], 'z') + '& = ' + b[1] + '\\\\');
        buffer.push(kVar(A[2][0], 'x', true) + '&' + kVar(A[2][1], 'y') + '&' + kVar(A[2][2], 'z') + '& = ' + b[2] + '\\\\');
        buffer.push('\\end{align}');
        return buffer.join('');
    };

    extension.display_as_base = function(A) {
        var buffer = [];
        buffer.push('\\left(');
        buffer.push(display_as_matrix([[A[0][0]], [A[1][0]], [A[2][0]]]), ', ');
        buffer.push(display_as_matrix([[A[0][1]], [A[1][1]], [A[2][1]]]), ', ');
        buffer.push(display_as_matrix([[A[0][2]], [A[1][2]], [A[2][2]]]));
        buffer.push('\\right');
        return buffer.join('');
    };

    extension.matrix_equality_percent = function(A, B) {
        if (A.rows    !== B.rows   ) return 0;
        if (A.columns !== B.columns) return 0;

        var i, j;
        var equalCells = 0;
        for (i=0; i < A.rows; i++) {
            for (j=0; j < A.columns; j++) {
                if (A[i][j] === B[i][j]) equalCells++;
            }
        }

        return equalCells / (A.rows * A.columns);
    };

    // Matrix generation
    scope.addFunction(new funcObj('simple_matrix', [TList], TMatrix, extension.simple_matrix, {unwrapValues: true}));
    scope.addFunction(new funcObj('simple_imatrix', [TList], TMatrix, extension.simple_imatrix, {unwrapValues: true}));

    scope.addFunction(new funcObj('simple_imatrix', [TList], TMatrix, extension.simple_imatrix, {unwrapValues: true}));

    // Display
    scope.addFunction(new funcObj('display_as_base', [TList], TMatrix, extension.simple_imatrix, {unwrapValues: true}));
    scope.addFunction(new funcObj('display_as_system', [TList], TMatrix, extension.simple_imatrix, {unwrapValues: true}));
    scope.addFunction(new funcObj('display_as_matrix', [TList], TMatrix, extension.simple_imatrix, {unwrapValues: true}));

});
