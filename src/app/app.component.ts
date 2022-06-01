import { Component, AfterViewInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { STYLES as SLIDER_STYLES } from '@alyle/ui/slider';
import { ThemeVariables, ThemeRef, lyl, StyleRenderer } from '@alyle/ui';
import {
  STYLES as CROPPER_STYLES,
  LyImageCropper,
  ImgCropperConfig,
  ImgCropperEvent,
  ImgCropperErrorEvent,
  ImgCropperLoaderConfig,
  ImgResolution
} from '@alyle/ui/image-cropper';
import { Platform } from '@angular/cdk/platform';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  ref.renderStyleSheet(SLIDER_STYLES);
  ref.renderStyleSheet(CROPPER_STYLES);
  const slider = ref.selectorsOf(SLIDER_STYLES);
  const cropper = ref.selectorsOf(CROPPER_STYLES);

  return {
    root: lyl `{
      ${cropper.root} {
        width: 400px
        height: 320px
      }
      ${slider.root} {
        width: 100%
        max-width: 400px
        padding-left: 1em
        padding-right: 1em
      }
    }`,
    sliderContainer: lyl `{
      text-align: center
      max-width: 400px
      padding: 14px
      box-sizing: border-box
    }`
  };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [StyleRenderer]
})
export class AppComponent implements AfterViewInit {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  croppedImage?: string;
  ready!: boolean;
  scale!: any;
  minScale!: number;
  maxScale!: number;
  class!: string;
  canvas!: any;
  selectedPortrait: boolean = true;
  filterClass: string = '';
  @ViewChild(LyImageCropper, { static: true }) cropper!: LyImageCropper;
  myConfig: ImgCropperConfig = {
    // 3:1 aspect ratio
    width: 400 * 7,
    height: 400 * 10,
    keepAspectRatio: true,
    responsiveArea: true,
    output: ImgResolution.OriginalImage,
  };

  constructor(
    readonly sRenderer: StyleRenderer,
    private _platform: Platform
  ) { }

  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      const config: ImgCropperLoaderConfig = {
        rotation: 0,
        xOrigin: 3235.7749135491986,
        yOrigin: 1711.626216978359,
        scale:   0.11451599999999999,
        originalDataURL: ''
      };
      this.cropper.loadImage(config);
    }
  }

  applyAndDraw(): void {
    this.canvas = document.getElementById('image') as any;
    const ctx = this.canvas.getContext('2d');
    ctx.filter = 'sepia(50%)';
    const img = document.getElementById('dataimage');
    ctx.drawImage(img, 0, 0,  this.canvas.width,  this.canvas.height);
  }

  addSepia(): void {
    const ctx = this.canvas.getContext('2d');
    ctx.sepia(1);
  }

  download(): void {
    document.location.href = this.canvas.toDataURL('image/jpeg');
  }

  onCropped(e: ImgCropperEvent) {
    this.croppedImage = e.dataURL;
    console.log('cropped img: ', e);
  }
  onLoaded(e: ImgCropperEvent) {
    console.log('img loaded', e);
  }
  onError(e: ImgCropperErrorEvent) {
    console.warn(`'${e.name}' is not a valid image`, e);
  }
}
