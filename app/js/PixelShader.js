/**
 * @author John Turesson
 */

THREE.PixelShader = {

    uniforms: {

        "tDiffuse": {
            type: "t",
            value: null
        },

        "uColorPalette": {
            type: "fv",
            value: [
            244, 228, 84,
            255, 92, 0,
            192, 101, 50,
            102, 195, 225,
            33, 155, 194,
            237, 98, 147,
            181, 82, 117
            /*225, 226, 115,
            80, 176, 157,
            198, 89, 171,
            111, 98, 188*/
            //85, 0, 0,
            //150, 200, 255,
            //170, 57, 75,
            //255, 170, 170
            ]
        }

    },

    vertexShader: document.getElementById('v-shader-pixel').textContent,

    fragmentShader: document.getElementById('f-shader-pixel').textContent

};