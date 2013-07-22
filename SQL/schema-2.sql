CREATE DATABASE chat;

USE chat;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(21),
  PRIMARY KEY  (`id`)
);

CREATE TABLE `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(250),
  `timestamp` TIMESTAMP,
  `room` VARCHAR(21),
  `user_id` INT,
  PRIMARY KEY  (`id`)
);

CREATE TABLE `friends` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT,
  `friend_id` INT,
  PRIMARY KEY  (`id`)
);


ALTER TABLE `messages` ADD CONSTRAINT `messages_fk1` FOREIGN KEY (`user_id`) REFERENCES users(`id`);
ALTER TABLE `friends` ADD CONSTRAINT `friends_fk1` FOREIGN KEY (`user_id`) REFERENCES users(`id`);
ALTER TABLE `friends` ADD CONSTRAINT `friends_fk2` FOREIGN KEY (`friend_id`) REFERENCES users(`id`);
