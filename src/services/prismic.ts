import * as prismic from "@prismicio/client";

export function getPrismicClient() {
    const client = prismic.createClient(
        "https://ignews606.cdn.prismic.io/api/v2",
        {
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        });

    return client;
}