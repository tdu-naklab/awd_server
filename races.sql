DROP TABLE IF EXISTS races;
CREATE TABLE `races` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `course` int(1) NOT NULL,
  `status` int(1) DEFAULT '0' NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS race_user;
CREATE TABLE `race_user` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `race_id` int(4) NOT NULL,
  `user_id` int(4) NOT NULL,
  `raptime` int(8),
  `lane` int(1) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
