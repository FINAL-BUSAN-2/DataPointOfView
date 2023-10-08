<div align="right">
<a href="https://github.com/FINAL-BUSAN-2/DataPointOfView/tree/develop#2-%ED%8C%80-%EA%B5%AC%EC%84%B1--role">메인 화면 이동</a>
</div>
<br>

# Hadoop 세팅

> https://velog.io/@och5351/Hadoop-%EC%84%A4%EC%B9%98

CentOS 7 기준

Hadoop 은 현 시점(2023.03.01) 최신 버전인 3.3.4를 설치한다.

datanode의 경우 data01, data02 로 disk를 2개씩 가지고 있다.

> <a href="https://mr-devlife.com/how-to-install-hadoop3/">참고</a>

### 노드 구성

<br>

- namenode : CPU : 4core / memory 16GB / Disk 100GB
- secondary : CPU : 4core / memory 16GB / Disk 100GB
- datanode1 : CPU : 2core / memory 8GB / Disk1 100GB / Disk2 100GB
- datanode2 : CPU : 2core / memory 8GB / Disk1 100GB / Disk2 100GB
- datanode3 : CPU : 2core / memory 8GB / Disk1 100GB / Disk2 100GB

<br><br>

# 1. 자바 설치

<br>

hadoop 3.3.4 는 jdk 11 버전을 권장하고 있으므로 `java-11-openjdk-devel`를 설치한다.

`java-11-openjdk` 를 설치하게 되면 jps 명령어가 동작하지 않는다. 반드시 `java-11-openjdk-devel`을 설치하도록 한다. <br>

> <a href="https://stackoverflow.com/questions/11286669/jps-not-working">jps 동작 하지 않는 현상 관련 Stack overflow 참조</a> <br>

> <a href="https://och5351.github.io/setting/CentOS7-Java-%EC%84%A4%EC%B9%98/">CentOS7 Java 설치</a> <br>

> <a href="https://unix.stackexchange.com/questions/178827/what-is-the-difference-between-these-three-java-installations">openjdk 와 openjdk-devel의 차이</a> <br>

> 자바 설치 후 `"readlink -f $(which java)"` 명령어를 사용하여 java 가 설치된 위치를 알아낼 수 있다.

<br><br>

# 2. 각 서버 계정 설정

<br>

```bash
# hdfs 그룹 및 계정 생성
addgroup --gid 2001 hdfs
adduser --create-home --shell /bin/bash --gid 2001 --uid 2001 hdfs
passwd hdfs

# yarn 그룹 및 계정 생성
addgroup --gid 2002 yarn
adduser --create-home --shell /bin/bash --gid 2002 --uid 2002 yarn
passwd yarn
```

<br><br>

# 3. Data directory 생성

<br>

### namenode , secondarynode 서버

```bash
mkdir -p /data/hdfs/namenode
mkdir -p /data/hdfs/jornalnode
chown -R hdfs:hdfs /data/hdfs
mkdir -p /data/yarn
chown -R yarn:yarn /data/yarn
```

<br>

### datanode1,2,3 서버

```bash
mkdir -p /data01/hdfs/dn
chown -R hdfs:hdfs /data01/hdfs

mkdir -p /data02/hdfs/dn
chown -R hdfs:hdfs /data02/hdfs

mkdir -p /data01/yarn
chown -R yarn:yarn /data01/yarn

mkdir -p /data02/yarn
chown -R yarn:yarn /data02/yarn
```

<br><br>

# 4. 각 서버 Hostname 설정 및 /etc/hosts 설정

<br>

```bash
# master node setting
hostnamectl set-hostname name01.devdap.com
hostnamectl set-hostname secondary01.devdap.com

# worker node setting
hostnamectl set-hostname data01.devdap.com
hostnamectl set-hostname data02.devdap.com
hostnamectl set-hostname data03.devdap.com

# 모든 노드 hosts 파일 변경
vi /etc/hosts

192.168.56.100 name01.devdap.com name01
192.168.56.150 secondary01.devdap.com secondary01

# worker node setting
192.168.56.200 data01.devdap.com data01
192.168.56.201 data02.devdap.com data02
192.168.56.202 data03.devdap.com data03
```

<br><br>

# 5. SSH Key 교환

name, secondary 노드의 hdfs, yarn 계정 모두 키를 생성하여 각각 노드마다 키 교환을 해준다.

```bash
# hdfs
su hdfs
ssh-keygen # 공개키 생성
ssh-copy-id hdfs@data01.devdap.com
ssh-copy-id hdfs@data02.devdap.com
ssh-copy-id hdfs@data03.devdap.com

# yarn
su yarn
ssh-keygen #공개키 생성
ssh-copy-id yarn@data01.devdap.com
ssh-copy-id yarn@data02.devdap.com
ssh-copy-id yarn@data03.devdap.com
```

<br><br>

# 6. 하둡 다운

<br>

모든 노드에 하둡을 설치해 준다.

```bash
# /opt 경로에 다운을 받아준다.
cd /opt

wget https://dlcdn.apache.org/hadoop/common/hadoop-3.3.4/hadoop-3.3.4.tar.gz

tar -zxvf hadoop-3.3.4.tar.gz

sudo mkdir /opt/hadoop-3.3.4/pids
sudo mkdir /opt/hadoop-3.3.4/logs
sudo chown -R hdfs:hdfs /opt/hadoop-3.3.4
sudo chmod 757 /opt/hadoop-3.3.4/pids
sudo chmod 757 /opt/hadoop-3.3.4/logs
```

<br><br>

# 7. 하둡 설정(name, secondary node)

<br>

## `hadoop-env.sh`

```bash
# master 노드 설정

cd /opt/hadoop-3.3.4/etc/hadoop

sudo vi hadoop-env.sh

# hadoop-env.sh(맨 아래에 저장)
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export HADOOP_HOME=/opt/hadoop-3.3.4
export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
export HADOOP_MAPRED_HOME=${HADOOP_HOME}
export HADOOP_COMMON_HOME=${HADOOP_HOME}
export HADOOP_LOG_DIR=${HADOOP_HOME}/logs
export HADOOP_PID_DIR=${HADOOP_HOME}/pids
export HDFS_NAMENODE_USER="hdfs"
export HDFS_DATANODE_USER="hdfs"
export YARN_RESOURCEMANAGER_USER="yarn"
export YARN_NODEMANAGER_USER="yarn"
```

## core-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-project-dist/hadoop-common/core-default.xml">core-site.xml default documentation</a>

```bash
sudo vi core-site.xml
```

```xml
<configuration>
	<property>
		<name>fs.defaultFS</name>
		<value>hdfs://name01.devdap.com:9000</value>
		<description>NameNode URI</description>
	</property>
	<property>
		<name>io.file.buffer.size</name>
		<value>131072</value>
		<description>Buffer size</description>
	</property> <!-- HA Configuration -->
	<property>
		<name>ha.zookeeper.quorum</name>
		<value>zookeeper-001:2181,zookeeper-002:2181,zookeeper-003:2181</value>
	</property>
	<property>
		<name>dfs.ha.fencing.methods</name>
		<value>sshfence</value>
	</property>
	<property>
		<name>dfs.ha.fencing.ssh.private-key-files</name>
		<value>/home/hdfs/.ssh/id_rsa</value>
	</property>
</configuration>
```

## hdfs-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml">hdfs-site.xml default documentation</a>

```bash
sudo vi hdfs-site.xml
```

```xml
<configuration>
	<property>
		<name>dfs.replication</name>
		<value>3</value>
	</property>
	<property>
		<name>dfs.permissions</name>
		<value>false</value>
	</property>
	<property>
		<name>dfs.namenode.http-address</name>
		<value>name01.devdap.com:9870</value>
	</property>
	<property>
		<name>dfs.namenode.secondary.http-address</name>
		<value>secondary01.devdap.com:9868</value>
	</property>
	<property>
		<name>dfs.namenode.name.dir</name>
		<value>file:/data/hdfs/namenode</value>
	</property>
</configuration>
```

## mapred-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml">mapred-site.xml default documentation</a>

```bash
sudo vi mapred-site.xml
```

```xml
<configuration>
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>
</configuration>
```

## yarn-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-yarn/hadoop-yarn-common/yarn-default.xml">yarn-site.xml default documentation</a>

```bash
sudo vi yarn-site.xml
```

```xml
<configuration>
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
	<property>
		<name>yarn.resourcemanager.hostname</name>
		<value>master1.dev.com</value>
	</property>
	<property>
		<name>yarn.nodemanager.resource.memory-mb</name>
		<value>1024</value>
	</property>
	<property>
		<name>yarn.nodemanager.resource.cpu-vcores</name>
		<value>1</value>
	</property>
  <property>
    <name>yarn.resourcemanager.webapp.address</name>
    <value>master1.dev.com:8080</value>
  </property>
  <property>
    <name>yarn.webapp.ui2.enable</name>
    <value>true</value>
  </property>
	<property>
		<name>yarn.nodemanager.env-whitelist</name>
		<value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>
	</property>
</configuration>
```

## workers

```bash
sudo vi workers
```

```
master1.dev.com
workder1.dev.com
```

<br><br>

# 8. 하둡 설정(worker node)

<br>

## `hadoop-env.sh`

```bash
cd /opt/hadoop-3.3.4/etc/hadoop

sudo vi hadoop-env.sh

export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
export HADOOP_HOME=/opt/hadoop-3.3.4
export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
export HADOOP_MAPRED_HOME=${HADOOP_HOME}
export HADOOP_COMMON_HOME=${HADOOP_HOME}
export HADOOP_LOG_DIR=${HADOOP_HOME}/logs
export HADOOP_PID_DIR=${HADOOP_HOME}/pids
export HDFS_NAMENODE_USER="hdfs"
export HDFS_DATANODE_USER="hdfs"
export YARN_RESOURCEMANAGER_USER="yarn"
export YARN_NODEMANAGER_USER="yarn"
```

## core-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-project-dist/hadoop-common/core-default.xml">core-site.xml default documentation</a>

```bash
sudo vi core-site.xml
```

```xml
<configuration>
	<property>
		<name>fs.defaultFS</name>
		<value>hdfs://name01.devdap.com:9000</value>
	</property>
</configuration>
```

## hdfs-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-project-dist/hadoop-hdfs/hdfs-default.xml">hdfs-site.xml default documentation</a>

```bash
sudo vi hdfs-site.xml
```

```xml
<configuration>
	<property>
		<name>dfs.replication</name>
		<value>3</value>
	</property>
	<property>
		<name>dfs.permissions</name>
		<value>false</value>
	</property>
	<property>
		<name>dfs.datanode.data.dir</name>
		<value>file:/data01/hdfs/dn,file:/data02/hdfs/dn</value>
	</property>
</configuration>
```

## mapred-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-mapreduce-client/hadoop-mapreduce-client-core/mapred-default.xml">mapred-site.xml default documentation</a>

```bash
sudo vi mapred-site.xml
```

```xml
<configuration>
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>
</configuration>
```

## yarn-site.xml

<a href="https://hadoop.apache.org/docs/r3.3.4/hadoop-yarn/hadoop-yarn-common/yarn-default.xml">yarn-site.xml default documentation</a>

```bash
sudo vi yarn-site.xml
```

```xml
<configuration>
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
	<property>
		<name>yarn.resourcemanager.hostname</name>
		<value>name01.devdap.com</value>
	</property>
	<property>
		<name>yarn.nodemanager.resource.memory-mb</name>
		<value>1024</value>
	</property>
	<property>
		<name>yarn.nodemanager.resource.cpu-vcores</name>
		<value>1</value>
	</property>
	<property>
		<name>yarn.resourcemanager.webapp.address</name>
		<value>name01.devdap.com:8080</value>
	</property>
	<property>
		<name>yarn.webapp.ui2.enable</name>
		<value>true</value>
	</property>
	<property>
		<name>yarn.nodemanager.env-whitelist</name>
		<value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>
	</property>
</configuration>
```

<br><br>

# 9. 하둡 실행

<br>

name, secondary 노드에서 아래와 같이 하둡 포맷을 시킨다.

```
/opt/hadoop-3.3.4/bin/hdfs namenode -format
/opt/hadoop-3.3.4/sbin/start-all.sh
```

아래로 접속하여 ui 를 확인해본다.

- name01.devdap.com:9870
- name01.devdap.com:8080/ui2

<br><br>
