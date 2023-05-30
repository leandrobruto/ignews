import Head from 'next/head';
import styles from './styles.module.scss';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import { asText } from '@prismicio/helpers';
import Link from 'next/link';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostProps {
    posts: Post[]
}

export default function Posts({ posts }: PostProps) {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map(post =>(
                        <Link legacyBehavior key={post.slug} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    )) }
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const client = getPrismicClient()
    
    const response = await client.getAllByType("post", {
        fetch: ['publication.title', 'publication.content'],
        pageSize: 100
    })
    
    // console.log(JSON.stringify(response, null, 2));

    const posts = response.map(post => {
        return {
            slug: post.uid,
            title: post.data.title,
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        props: { posts }
    }
}