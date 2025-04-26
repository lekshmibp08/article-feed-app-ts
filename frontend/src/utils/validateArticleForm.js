const validateArticleForm = (formData, imageUrl) => {
  let errors = {};

  const tagsAsString = Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags;

  const validateField = (field, value, message) => {
      if (!value) {
          errors[field] = message;
      }
  };

  switch (true) {
      case !formData.title?.trim():
          validateField('title', formData.title?.trim(), "Title is required.");
          break;

      case !formData.category:
          validateField('category', formData.category, "Category is required.");
          break;

      case !formData.description?.trim():
          validateField('description', formData.description?.trim(), "Description is required.");
          break;

      case !formData.content?.trim():
          validateField('content', formData.content?.trim(), "Content is required.");
          break;

      case !imageUrl:
          validateField('imageUrl', imageUrl, "Please upload an image.");
          break;

      case !tagsAsString?.trim():
          validateField('tags', tagsAsString?.trim(), "At least one tag is required.");
          break;

      default:
          break;
  }

  return errors;
};

export default validateArticleForm;
