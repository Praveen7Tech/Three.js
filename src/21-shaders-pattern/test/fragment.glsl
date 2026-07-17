
varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(){
    // pattern 1
    //float strength = mod(vUv.y * 10.0, 1.0);

    // pattern 2
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // pattern 3
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

    // pattern 4
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // pattern 5
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // pattern 6
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength =barX + barY;

    // pattern 7
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0 , 1.0));

    // float strength =barX + barY;

    // pattern 8
    // float strength = abs(vUv.x - 0.5);

    //pattern 9
    //float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    //pattern 10
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    //pattern 11
    // float strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    //pattern 12
    //float strength = floor(vUv.x * 10.0) / 10.0;

    //pattern 13
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0;

    //pattern 14
    //float strength = random(vUv);

    //pattern 14
    vec2 gridUv = vec2(
        floor(vUv.x * 10.0) / 10.0, 
        floor(vUv.y * 10.0) / 10.0
    );
    float strength = random(gridUv);

    gl_FragColor = vec4(vec3(strength), 1.0);
}