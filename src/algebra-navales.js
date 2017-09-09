
Numbas.addExtension('algebra-navales', ['base', 'jme'], function(extension) {
    'use strict';

    // Useful variables
    var scope = extension.scope;

    var TMatrix = Numbas.jme.types.TMatrix;
    var TVector = Numbas.jme.types.TVector;
    var TList   = Numbas.jme.types.TList;
    var TNum    = Numbas.jme.types.TNum;
    var funcObj = Numbas.jme.funcObj;


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

    scope.addFunction(new funcObj('simple_matrix', [TList], TMatrix, extension.simple_matrix, {unwrapValues: true}));
    scope.addFunction(new funcObj('simple_imatrix', [TList], TMatrix, extension.simple_imatrix, {unwrapValues: true}));

});
