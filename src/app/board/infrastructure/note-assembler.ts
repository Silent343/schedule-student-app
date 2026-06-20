import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Note } from '../domain/model/note.entity';
import { NoteResource, NotesResponse } from './note-response';

export class NoteAssembler implements BaseAssembler<Note, NoteResource, NotesResponse> {
  toEntityFromResource(resource: NoteResource): Note {
    return new Note({
      id: resource.id,
      title: resource.title,
      subject: resource.subject,
      imageUrl: resource.imageUrl,
      dayLabel: resource.dayLabel,
      createdAt: resource.createdAt,
    });
  }

  toResourceFromEntity(entity: Note): NoteResource {
    return {
      id: entity.id,
      title: entity.title,
      subject: entity.subject,
      imageUrl: entity.imageUrl,
      dayLabel: entity.dayLabel,
      createdAt: entity.createdAt,
    };
  }

  toEntitiesFromResponse(_: NotesResponse): Note[] {
    return [];
  }
}
