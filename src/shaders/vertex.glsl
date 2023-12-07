uniform float uTime;
uniform float uWaveElevation;
uniform vec2 uWaveFrequency;
uniform float uWaveDirection;
varying float vWaveElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float wave = sin(modelPosition.x * uWaveFrequency.x * uWaveDirection + uTime * 5.0) * uWaveElevation / 4.0;
    modelPosition.y += wave;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vWaveElevation = wave;

    gl_Position = projectedPosition;
}
