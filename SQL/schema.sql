CREATE TABLE `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(25),
  `message` VARCHAR(250),
  `timestamp` TIMESTAMP,
  `room` VARCHAR(21),
  `user_id` INT,
  PRIMARY KEY  (`id`)
);