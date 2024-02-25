\c nc_news_test

SELECT articles.article_id,
    COUNT(articles.article_id)
    AS article_count
    FROM articles
    WHERE articles.article_id = 4
    GROUP BY articles.article_id;
