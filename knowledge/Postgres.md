<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
</div>
<br>

<br><br>

# 1. Postgres OS 계정

<br>

```bash
groupadd --gid 6000 postgres
adduser --create-home --shell /bin/bash --gid 6000 --uid 6000 postgres
passwd postgres
```

<br><br>

# 2. Postgres 다운

<br>

```bash
https://www.postgresql.org/ftp/source/v15.3/postgresql-15.3.tar.gz
```

<br><br>

# 3. Postgres 설치

<br>

```bash
cp ~/postgresql-15.3.tar.gz /opt

tar -zxf /opt/postgresql-15.3.tar.gz
cd postgresql-15.3

sudo ./configure --without-readline
sudo make && sudo make install

==========================================================
-- prefix 옵션은 엔진 설치 경로이며, 기본값은 '/usr/local/pgsql'
-- configure 과정에서 에러 발생 시 아래 패키지 설치 후 재 실행

configure: error: no acceptable C compiler found in $PATH
=> $ sudo yum install gcc

configure: error: readline library not found
=> $ sudo yum install readline-devel

configure: error: zlib library not found
=> $ sudo yum install zlib-devel
==========================================================

```

<br><br>

# 4. Postgres 설정

<br>

```bash
cd /pgData
vi pg_hba.conf
(맨 밑에)
host    all             all             172.16.1.1/32           md5 

vi postgresql.conf

listen_addresses = "172.16.1.25"
port = 5432
```

<br><br>

# 5. Postgres 초기화

<br>

```bash
cd /usr/local/pgsql/bin
./initdb -D /pgData
```

<br><br>

# 6. Postgres 실행

<br>

```bash
./pg_ctl -D /pgData start
waiting for server to start....
server started
```
```bash
# 정지
./pg_ctl -D /pgData stop
 waiting for server to shut down....
 server stopped

# 재실행
./pg_ctl -D /pgData restart
 waiting for server to shut down....
 server stopped
 waiting for server to start....
 server started
```

<br><br>

# 7. Postgres 전역 변수 설정

<br>

```bash
vi ~/.bash_profile
export LD_LIBRARY_PATH=:$HOME/pgsql/lib
export PATH=$PATH:$HOME/pgsql/bin
export PGDATA=$HOME/pgsql/data

source ~/.bash_profile
```

<br><br>

# 8. Postgres 계정 만들기

<br>

```bash
psql -p 5432

> CREATE USER user;

> alter user user with password 'passwd';

> create database user_db;

> GRANT ALL PRIVILEGES ON DATABASE user_db TO user;
> alter database user_db owner to user;
```

<br><br>

# 9. Postgres plugin 활성화

<br>

```bash
cd /opt/postgresql-15.3/contrib/btree_gist 
make -f Makefile
make install
cd /opt/postgresql-15.3/contrib/pg_trgm 
make -f Makefile
make install
```

> 참고 : https://docs.gitlab.com/ee/install/requirements.html#database
> * pg_trgm >= 8.6
> * btree_gist >= 13.1
> * plpgsql >= 11.7