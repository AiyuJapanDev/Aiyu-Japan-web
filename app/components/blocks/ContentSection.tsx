import "ckeditor5/ckeditor5-content.css";

export default function ContentSection({ data, lang, contentData }) {
  return <div dangerouslySetInnerHTML={{ __html: data.content }} />;
}
