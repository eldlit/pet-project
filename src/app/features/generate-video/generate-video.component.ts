import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { CommonModule } from "@angular/common";
import { GeneratorService } from "../../shared/services/generator.service";
import { ButtonModule } from "primeng/button";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-generate-video',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  providers: [GeneratorService],
  templateUrl: './generate-video.component.html',
  styleUrl: './generate-video.component.scss'
})
export class GenerateVideoComponent implements OnInit {
  public topic: string = '';
  public selectedFont: string = '';
  public sourceVideo: string = '';
  public selectedMusic: string = '';
  public videoUrl: string | undefined;
  public customText: string | undefined;
  public videoQuality: string = '';
  public musicOptions = [];
  public fontOptions = [];
  public videoQuatityOptions = [
    { label: '720', value: '720hd' },
    { label: '1080', value: '1080hd' },
    { label: '1440', value: '1440hd' }
  ];

  public videoGeneringInProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public generateVideoService: GeneratorService) {}

  public ngOnInit(): void {
    this.generateVideoService.getFontList().subscribe((res) => {
      this.fontOptions = res;
    });

    // Uncomment if needed
    // this.generateVideoService.getMusicList().subscribe((res) => {
    //   this.musicOptions = res;
    // });
  }

  public generateVideo(): void {
    this.videoGeneringInProgress$.next(true);
    this.videoUrl = undefined;

    const payload = {
      topic: this.topic,
      font: this.selectedFont,
      customeText: this.customText,
      ytLink: this.sourceVideo,
      music: this.selectedMusic,
      videoQuality: this.videoQuality
    };

    this.generateVideoService.generateVideo(payload).subscribe((res) => {
      if (res) {
        this.videoUrl = res.pathToFile;
        this.videoGeneringInProgress$.next(false);
      }
    });
  }
}
