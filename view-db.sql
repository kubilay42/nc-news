\c nc_news_test



SELECT * FROM comments 
FULL JOIN users
ON comments.author = users.username;



