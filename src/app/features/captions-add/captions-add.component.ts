import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgxColorsModule } from "ngx-colors";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { BehaviorSubject } from "rxjs";

import { GeneratorService } from "../../shared/services/generator.service";

@Component({
  selector: 'app-captions-add',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxColorsModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  providers: [GeneratorService],
  templateUrl: './captions-add.component.html',
  styleUrl: './captions-add.component.scss'
})
export class CaptionsAddComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('textInput') textInput!: ElementRef;

  videoUrl: string = '';
  videoWithCaptions!: string;
  textOverlay: string = 'Your nice test captions';
  fontColorOverlay: string = '#ffffff';
  backgroundColorOverlay: string = '';
  previewImage: string = '';
  textPlacement: string = '';
  fontFamily: string = 'Arial';
  fontSize: string = '';

  videoGeneringInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  file!: File;

  public textPlacementOptions = [
    { label: 'Bottom', value: 'bottom' },
    { label: 'Center', value: 'center' }
  ];

  public fontSizeOptions = [
    { label: '10 px', value: '10' },
    { label: '12 px', value: '12' },
    { label: '14 px', value: '14' },
    { label: '16 px', value: '16' },
    { label: '30 px', value: '30' }
  ];

  fontList = [
    { label: 'Cherry Cream Soda', value: 'Cherry Cream Soda Regular' },
    { label: 'Press Start 2P', value: 'Press Start 2P' },
    { label: 'Nunito', value: 'Nunito' }
  ];

  constructor(public generatorService: GeneratorService) {}

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.videoUrl = reader.result as string;
      this.generatePreviewImage();
    };
    reader.readAsDataURL(file);
  }

  generatePreviewImage() {
    const video = this.videoPlayer?.nativeElement;

    if (!video) {
      console.error("Video element is not available.");
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error("Canvas context is not available.");
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;

    const textWidth = ctx.measureText(this.textOverlay).width;
    let textX = 20;
    let textY = 50;

    if (this.textPlacement === 'center') {
      textX = (canvas.width - textWidth) / 2;
      textY = canvas.height / 2;
    } else if (this.textPlacement === 'bottom') {
      textX = (canvas.width - textWidth) / 2;
      textY = canvas.height - 20;
    }

    ctx.fillStyle = this.backgroundColorOverlay;
    ctx.fillRect(textX - 10, textY - +this.fontSize * 0.8, textWidth + 20, +this.fontSize * 1.2);
    ctx.fillStyle = this.fontColorOverlay;
    ctx.fillText(this.textOverlay, textX, textY);

    this.previewImage = canvas.toDataURL();
  }

  createVideo(): void {
    const videoSettings = {
      color: this.fontColorOverlay,
      fontSize: this.fontSize,
      fontName: this.fontFamily,
      alignment: this.textPlacement,
      textSegmentation: 'segment'
    };

    this.videoGeneringInProgress$.next(true);

    this.generatorService.uploadVideoWithSubtitles(this.file, videoSettings).subscribe((video) => {
      if (video) {
        this.videoWithCaptions = video.downloadLink;
        this.videoGeneringInProgress$.next(false);
      }
    });
  }

  chooseFile(): void {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
}
