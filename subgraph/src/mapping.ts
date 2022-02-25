import { TagCreated, TagUpdated, TagDeleted } from "../generated/TagStore/TagStore";
import { QuestionCreated, QuestionUpdated, QuestionDeleted } from "../generated/QuestionStore/QuestionStore";
import { Tag, Question } from "../generated/schema";

// Tag

export function handleTagCreated(event: TagCreated): void {
  const tag = new Tag(event.params.tag.id.toHexString());
  tag.name = event.params.tag.name;
  tag.description = event.params.tag.description;
  tag.creator = event.params.tag.creator.toHexString();
  tag.deleted = event.params.tag.deleted;
  tag.createdAt = event.block.timestamp;
  tag.updatedAt = event.block.timestamp;
  tag.save();
}

export function handleTagUpdated(event: TagUpdated): void {
  const tag = Tag.load(event.params.tag.id.toHexString());
  if (tag) {
    tag.description = event.params.tag.description;
    tag.updatedAt = event.block.timestamp;
    tag.save();
  }
}

export function handleTagDeleted(event: TagDeleted): void {
  const tag = Tag.load(event.params.tag.id.toHexString());
  if (tag) {
    tag.deleted = event.params.tag.deleted;
    tag.updatedAt = event.block.timestamp;
    tag.save();
  }
}

// Question

export function handleQuestionCreated(event: QuestionCreated): void {
  const question = new Question(event.params.question.id.toHexString());
  question.title = event.params.question.title;
  question.body = event.params.question.body;
  question.creator = event.params.question.creator.toHexString();
  question.deleted = event.params.question.deleted;
  question.tags = event.params.question.tags.map<string>((tag) =>
    tag.toHexString()
  );
  question.createdAt = event.block.timestamp;
  question.updatedAt = event.block.timestamp;
  question.save();
}

export function handleQuestionUpdated(event: QuestionUpdated): void {
  const question = Question.load(event.params.question.id.toHexString());
  if (question) {
    question.title = event.params.question.title;
    question.body = event.params.question.body;
    question.tags = event.params.question.tags.map<string>((tag) =>
      tag.toHexString()
    );
    question.updatedAt = event.block.timestamp;
    question.save();
  }
}

export function handleQuestionDeleted(event: QuestionDeleted): void {
  const question = Tag.load(event.params.question.id.toHexString());
  if (question) {
    question.deleted = event.params.question.deleted;
    question.updatedAt = event.block.timestamp;
    question.save();
  }
}
