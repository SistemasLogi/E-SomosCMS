export const PublicationPublicQueries = {
  getCmsItemList: (cms_item_id) => `
    {
        cmsItemList${cms_item_id ? `(id: ${cms_item_id})` : ""} {
            status
            status_code
            status_message
            cms_items {
                id
                cms_item_name
                cms_item_title
                url_header_image
                text_add
                sections {
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
    }`,
};
