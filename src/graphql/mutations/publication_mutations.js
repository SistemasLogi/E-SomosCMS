export const PublicationMutations = {
  setUpdateItemWithImage: (cms_item_id, cms_item_title, text_add) => `
        mutation($file_image: Upload!) {
          updatePrincipalItem(input: {
            cms_item_id: ${cms_item_id}
            cms_item_title: "${cms_item_title}"
            url_header_image: $file_image
            text_add: "${text_add}"
          }) {
            status
            status_code
            status_message
            cms_item {
              id
              cms_item_name
              cms_item_title
              url_header_image
              text_add
            }
          }
        }
    `,

  setUpdateItemWithoutImage: (cms_item_id, cms_item_title, text_add) => `
        mutation {
          updatePrincipalItemNotImage(input: {
            cms_item_id: ${cms_item_id}
            cms_item_title: "${cms_item_title}"
            text_add: "${text_add}"
          }) {
            status
            status_code
            status_message
            cms_item {
              id
              cms_item_name
              cms_item_title
              url_header_image
              text_add
            }
          }
        }
    `,

  setDeleteImageHeaderItem: (item_id) => `
    mutation {
      deletePrincipalItemImage(id: ${item_id}) {
        status
        status_code
        status_message
        cms_item {
          id
          cms_item_name
          cms_item_title
          url_header_image
          text_add
        }
      }
    }
    `,

  setUpsertSection: ({
    id = null, // Por defecto es null
    cms_item_id,
    section_title,
    section_type,
    section_description = null, // Campo opcional
    img_header = null, // Imagen opcional para el header
    img_card = null, // Imagen opcional para el card
  }) => {
    // Construcción dinámica del input
    let input = `
        cms_item_id: ${cms_item_id}
        section_title: "${section_title}"
        section_type: "${section_type}"
      `;

    if (id) {
      input += ` id: ${id}`;
    }
    // Incluir la descripción si está presente
    if (section_description) {
      input += `\n      section_description: "${section_description}"`;
    }

    // Incluir las imágenes si están presentes
    if (img_header) {
      input += `\n      url_header_image: $img_header`;
    }
    if (img_card) {
      input += `\n      url_card_image: $img_card`;
    }

    // Construcción de las variables
    let variables = [];
    if (img_header) {
      variables.push("$img_header: Upload");
    }
    if (img_card) {
      variables.push("$img_card: Upload");
    }

    return `
        mutation(${variables.join(", ")}) {
          upsertSection(input: { ${input} 
          }) {
            status
            status_code
            status_message
            section {
              id
              cms_item_id
              section_title
              section_description
              url_header_image
              url_card_image
              section_type
            }
          }
        }
      `;
  },

  setUpsertSectionWithoutImage: ({
    id = null, // Por defecto es null (creación)
    cms_item_id,
    section_title,
    section_type,
    section_description = null, // Campo opcional
  }) => {
    // Construcción dinámica del input
    let input = `
        cms_item_id: ${cms_item_id}
        section_title: "${section_title}"
        section_type: "${section_type}"
      `;

    // Si se proporciona un id, se incluye en el input (actualización)
    if (id) {
      input += `\n      id: ${id}`;
    }

    // Incluir la descripción si está presente
    if (section_description) {
      input += `\n      section_description: "${section_description}"`;
    }

    return `
        mutation {
          upsertSection(input: { ${input} }) {
            status
            status_code
            status_message
            section {
              id
              cms_item_id
              section_title
              section_description
              url_header_image
              url_card_image
              section_type
            }
          }
        }
      `;
  },

  setDeleteSection: (section_id) => `
    mutation {
      deleteSection(id: ${section_id}) {
        status
        status_code
        status_message
      }
    }
    `,

  setDeleteImageSection: (section_id) => `
    mutation {
      deleteSectionImageHeader(id: ${section_id}) {
        status
        status_code
        status_message
        section {
          id
          cms_item_id
          section_title
          section_description
          url_header_image
          url_card_image
          section_type
        }
      }
    }
    `,

  setUpsertEntry: ({
    id = null,
    section_id,
    entry_title,
    entry_complement,
  }) => {
    // Construcción dinámica del input
    let input = `
        section_id: ${section_id}
        entry_title: "${entry_title}"
        entry_complement: "${entry_complement}"
      `;

    // Si se proporciona un id, se incluye en el input (actualización)
    if (id) {
      input += `\n      id: ${id}`;
    }

    return `
        mutation {
          upsertEntry(input: { ${input} }) {
            status
            status_code
            status_message
            entry {
              id
              section_id
              entry_title
              entry_complement
            }
          }
        }
      `;
  },

  setDeleteEntry: (entry_id) => `
  mutation {
    deleteEntry(id: ${entry_id}) {
      status
      status_code
      status_message
    }
  }
  `,

  setUpsertFileEntry: ({
    id = null,
    entry_id,
    url_file = null,
    file_type = null,
    element_order = null,
  }) => {
    // Construcción del input dinámico
    let input = `entry_id: ${entry_id}`;

    if (id) {
      input += `\n      id: ${id}`;
    }
    if (file_type) {
      input += `\n      file_type: "${file_type}"`;
    }
    if (element_order !== null) {
      input += `\n      element_order: ${element_order}`;
    }
    if (url_file) {
      input += `\n      url_file: $file_entry`;
    }

    // Si url_file está presente, se requiere la variable ($file_entry: Upload), de lo contrario, se omite
    const variables = url_file ? "($file_entry: Upload)" : "";

    return `
      mutation${variables} {
        upsertFileEntry(input: { ${input} }) {
          status
          status_code
          status_message
          file_entry {
            id
            entry_id
            url_file
            file_type
            element_order
          }
        }
      }
    `;
  },

  setUpsertContentEntry: ({
    id = null,
    entry_id,
    content = null,
    content_type = null,
    element_order = null,
  }) => {
    // Construcción dinámica del input
    let input = `entry_id: ${entry_id}`;

    if (id) {
      input += `\n      id: ${id}`;
    }
    if (content) {
      input += `\n      content: "${content}"`;
    }
    if (content_type) {
      input += `\n      content_type: "${content_type}"`;
    }
    if (element_order !== null) {
      input += `\n      element_order: ${element_order}`;
    }

    return `
      mutation {
        upsertContentEntry(input: { ${input} }) {
          status
          status_code
          status_message
          contentEntry {
            id
            entry_id
            content
            content_type
            element_order
          }
        }
      }
    `;
  },

  setDeleteFileEntry: (file_entry_id) => `
  mutation {
    deleteFileEntry(id: ${file_entry_id}) {
      status
      status_code
      status_message
    }
  }
  `,

  setDeleteContentEntry: (content_entry_id) => `
  mutation {
    deleteContentEntry(id: ${content_entry_id}) {
      status
      status_code
      status_message
    }
  }
  `,
};
