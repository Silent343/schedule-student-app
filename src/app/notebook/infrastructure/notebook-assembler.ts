import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Notebook } from '../domain/model/notebook.entity';
import { NotebookPage } from '../domain/model/notebook-page';
import { NotebookResource, NotebooksResponse } from './notebook-response';

export class NotebookAssembler
  implements BaseAssembler<Notebook, NotebookResource, NotebooksResponse>
{
  toEntityFromResource(resource: NotebookResource): Notebook {
    return new Notebook({
      id: resource.id,
      title: resource.title,
      subject: resource.subject,
      coverColor: resource.coverColor,
      pages: (resource.pages ?? []).map(
        (p) => new NotebookPage({ id: p.id, heading: p.heading, content: p.content }),
      ),
    });
  }

  toResourceFromEntity(entity: Notebook): NotebookResource {
    return {
      id: entity.id,
      title: entity.title,
      subject: entity.subject,
      coverColor: entity.coverColor,
      pages: entity.pages.map((p) => ({ id: p.id, heading: p.heading, content: p.content })),
    };
  }

  toEntitiesFromResponse(_: NotebooksResponse): Notebook[] { return []; }
}
