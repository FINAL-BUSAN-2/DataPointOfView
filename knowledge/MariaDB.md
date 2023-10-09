<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
</div>
<br>

CentOS 7 기준

<br><br>

# 1. maria db user

<br>

```bash
groupadd --gid 3000 mysql
adduser --create-home --shell /bin/bash --gid 3000 --uid 3000 mysql
passwd mysql
```

<br><br>

# 2. maria db 다운

<br>

```bash
cd /opt
wget https://archive.mariadb.org/mariadb-10.11.2/bintar-linux-systemd-x86_64/mariadb-10.11.2-linux-systemd-x86_64.tar.gz
```

<br><br>

# 3. maria db 압축 해제 및 링크

<br>

```bash
tar -zvxf mariadb-10.11.2-linux-systemd-x86_64.tar.gz

sudo ln -s /opt/mariadb-10.11.2-linux-systemd-x86_64/ /usr/local/mysql
```

<br><br>

# 4. maria db 엔진 디렉토리 생성 및 권한 부여

<br>

```bash
# 엔진 디렉토리

sudo mkdir -pv /data/mysql/mysql-data
sudo mkdir -pv /data/mysql/mysql-ibdata
sudo mkdir -pv /data/mysql/tmpdir
sudo chown -R mysql:mysql /data/mysql
```

<br><br>

# 5. maria db Log 디렉토리 생성 및 권한 부여

<br>

```bash
# Log 디렉토리

sudo mkdir -pv /var/log/mariadb
sudo mkdir -pv /var/log/mariadb/binary
sudo mkdir -pv /var/log/mariadb/error
sudo mkdir -pv /var/log/mariadb/slow
sudo mkdir -pv /var/log/mariadb/relay
```

<br><br>

# 6. export

```bash
vi /etc/profile

export MARIADB_HOME=/usr/local/mysql
export PATH=$PATH:$MARIADB_HOME/bin:.

source /etc/profile
```

<br><br>

# 7. my.conf 설정

<br>

```bash
sudo mv /etc/my.cnf /usr/local/mysql/
sudo ln -s /usr/local/mysql/my.cnf /etc/my.cnf

sudo vi $MARIADB_HOME/my.conf
```

## Master 서버

```shell
[client]
port                            =3306
socket                          =/tmp/mysql.sock

[mysqld]
server-id                       =1 	 # =>master 서버
port                            =3306
socket                          =/tmp/mysql.sock
basedir                         =$MARIADB_HOME
datadir                         =/data/mysql/mysql-data
tmpdir                          =/data/mysql/tmpdir
user                            =mysql
log-bin                         =/var/log/mariadb/binary/mysql-bin
log-error                       =/var/log/mariadb/error/mariadb.err
slow_query_log_file             =/var/log/mariadb/slow/mariadb-slow-query.log
relay-log                       = /var/log/mariadb/relay/mariadb-relay
max_binlog_size                 =1G
binlog_format                   =MIXED
binlog_cache_size               =2M
report-host                     =hive01 # =>master 서버
expire_logs_days                =10
relay_log_purge                 =0
long_query_time                 =10
sync_binlog                     =1
log_warnings                    =2

# Character set Config (utf8mb4)
character_set-client-handshake  = FALSE
character-set-server            = utf8mb4
collation_server                = utf8mb4_general_ci
init_connect                    = set collation_connection=utf8mb4_general_ci
init_connect                    = set names utf8mb4
log_slave_update                =ON

[mysqld_safe]
log-error                       =/var/log/mariadb/error/mariadb.err
pid-file                        =/data/mysql/mariadb.pid

!includedir /etc/my.cnf.d
```

## Slave 서버

```shell
[client]
port                            =3306
socket                          =/tmp/mysql.sock

[mysqld]
server-id                       =2	# =>slave 서버
port                            =3306
socket                          =/tmp/mysql.sock
basedir                         =$MARIADB_HOME
datadir                         =/data/mysql/mysql-data
tmpdir                          =/data/mysql/tmpdir
user                            =mysql
log-bin                         =/var/log/mariadb/binary/mysql-bin
log-error                       =/var/log/mariadb/error/mariadb.err
slow_query_log_file             =/var/log/mariadb/slow/mariadb-slow-query.log
relay-log                       = /var/log/mariadb/relay/mariadb-relay
max_binlog_size                 =1G
binlog_format                   =MIXED
binlog_cache_size               =2M
report-host                     =hive02	# =>slave 서버
expire_logs_days                =10
relay_log_purge                 =0
long_query_time                 =10
sync_binlog                     =1
log_warnings                    =2

# Character set Config (utf8mb4)
character_set-client-handshake  = FALSE
character-set-server            = utf8mb4
collation_server                = utf8mb4_general_ci
init_connect                    = set collation_connection=utf8mb4_general_ci
init_connect                    = set names utf8mb4
log_slave_update                =ON

[mysqld_safe]
log-error                       =/var/log/mariadb/error/mariadb.err
pid-file                        =/data/mysql/mariadb.pid

!includedir /etc/my.cnf.d
```

<br><br>

# 8. 각 서버 Maria DB 실행

<br>

```bash
su mysql

sudo ./mysql_install_db --socket=/tmp/mysql.sock --port=3306 --basedir=/usr/local/mysql --datadir=/data/mysql/mysql-data --user=mysql --defaults-file=/usr/local/mysql/my.cnf
```

<br><br>

# 9. mariadb service 등록

<br>

```bash
sudo cp /usr/local/mysql/support-files/systemd/mariadb.service /etc/systemd/system
```

<br><br>

# 10. 서비스 실행

<br>

```bash
# 서비스 실행이 안 될 경우 반드시 my.cnf 파일에 문제가 없는지 확인한다.
#서비스 실행
sudo systemctl start mariadb.service

#서비스 정지
sudo systemctl stop mariadb.service

#서비스 상태 확인
sudo systemctl status mariadb.service

#시스템 부팅시 자동시작
sudo systemctl enable mariadb.service
```

<br><br>

# 11. 서비스 등록

<br>

```bash
sudo cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql

sudo chkconfig --add /etc/init.d/mysql #서비스 목록에 추가

sudo chkconfig --level 2345 mysql on  # mysql 서비스를 run level 2345로 부팅시 프로세스시작

sudo service mysql start #서비스 실행

sudo service mysql stop #서비스 정지

** #chkconfig mysql off -- mysql 서비스 off
```

<br><br>

# 12. 기본 설정

<br>

```bash
# mariadb-secure-installation tool 실행

# cd /usr/local/mysql/bin
# ./mariadb-secure-installation

In order to log into MariaDB to secure it, we'll need the current
password for the root user. If you've just installed MariaDB, and
haven't set the root password yet, you should just press enter here.

Enter current password for root (enter for none):  [Enter]
OK, successfully used password, moving on...

※ 이 부분은 버전에 따라 안 나올 수 있습니다.
Setting the root password or using the unix_socket ensures that nobody
can log into the MariaDB root user without the proper authorisation.

You already have your root account protected, so you can safely answer 'n'.
Switch to unix_socket authentication [Y/n] Y  [MariaDB 실행 시 통신 소켓 생성 여부? Y 엔터]



Enabled successfully!
Reloading privilege tables..
 ... Success!


You already have your root account protected, so you can safely answer 'n'.

Change the root password? [Y/n] Y  [DB ROOT 패스워드 설정할 것인가? Y 엔터]

New password:  패스워드 입력
Re-enter new password:  재확인 패스워드 입력
Password updated successfully!
Reloading privilege tables..
 ... Success!

By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] Y  [익명의 접근을 막을 것인지? 보안을 위해 Y 엔터]
 ... Success!


Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] Y  [DB ROOT 원격을 막을 것인지? 보안을 위해 Y 엔터]

 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] Y

[Test 용으로 생성된 데이터베이스를 삭제할 것인가? Y 엔터]

 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] Y  [현재 설정한 값을 적용할 것인지? 당연히 Y 엔터]

 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!  [설정 완료]

```

<br><br>

# 13. maria db 재설치

<br>

```bash
sudo rm -rf /data/mysql/mysql-data
sudo rm -rf /data/mysql/mysql-ibdata
sudo rm -rf /data/mysql/tmpdir

sudo rm -rf /var/log/mariadb
sudo rm -rf /var/log/mariadb/binary
sudo rm -rf /var/log/mariadb/error
sudo rm -rf /var/log/mariadb/slow
sudo rm -rf /var/log/mariadb/relay

sudo mkdir pv /data/mysql/mysql-data
sudo mkdir -pv /data/mysql/mysql-ibdata
sudo mkdir -pv /data/mysql/tmpdir
sudo chown -R mysql:mysql /data/mysql

sudo mkdir -pv /var/log/mariadb
sudo mkdir -pv /var/log/mariadb/binary
sudo mkdir -pv /var/log/mariadb/error
sudo mkdir -pv /var/log/mariadb/slow
sudo mkdir -pv /var/log/mariadb/relay
sudo chown -R mysql. /var/log/mariadb
```

<br><br>
