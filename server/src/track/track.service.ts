import { CreateTrackDto } from './dto/create-track.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Track, Comment, CommentDocument, TrackDocument } from './schemas';
import { CommentDto } from './dto';
import { FileService, FileType } from '../file';
import { ICreateTrackResponse, ICommentResponse } from './interface';

@Injectable()
export class TrackService {
  //это делается чтобы мы могли использовать наши модели в сервисе
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(
    dto: CreateTrackDto,
    picture: string,
    audio: string,
  ): Promise<ICreateTrackResponse> {
    //чтобы создать трек нам вв эту фукцию нужно получить каккие-то данные dto
    const pictureFile = this.fileService.createFile(FileType.IMAGE, picture);
    const audioFile = this.fileService.createFile(FileType.AUDIO, audio);
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      picture: pictureFile,
      audio: audioFile,
    });
    return { isSuccess: true, track };
    //далее переходим в контроллер и работаем с запросом
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel.find().skip(offset).limit(count);
    return tracks;
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') }, //что за $regex ?
    });
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate('comments');
    return track;
  }

  async delete(
    id: ObjectId,
  ): Promise<{ isSuccess: boolean; trackId: ObjectId }> {
    const deletedTrack = await this.trackModel.findByIdAndDelete(id);
    return {
      isSuccess: true,
      trackId: deletedTrack._id,
    };
  }

  async addComment(dto: CommentDto): Promise<ICommentResponse> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto }); //mongo создало тут _id
    track.comments.push(comment._id); //изменили объект track но БД еще не не знает об этом
    await track.save(); //тут оповестили БД (сохранили изменения в ней)
    return { isSuccess: true, comment };
  }

  async listen(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens += 1;
    track.save();
  }
}
