uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying float vWaveElevation;

void main()
{
 vec3 color = mix(uDepthColor , uSurfaceColor, vWaveElevation);
 gl_FragColor = vec4(color, 1.0);
 #include <colorspace_fragment>
}