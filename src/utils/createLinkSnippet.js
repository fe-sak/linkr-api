import urlMetadata from 'url-metadata';

export default async function createLinkSnippet(link) {
  let snippet;
  await urlMetadata(link).then(
    (res) => {
      const { image, title, description } = res;
      snippet = { image, title, description };
    },
    () => {
      snippet = null;
    }
  );
  return snippet;
}
