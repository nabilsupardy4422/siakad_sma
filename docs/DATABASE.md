DATABASE SIAKAD SMA

TABLE: roles

id
name


TABLE: users

id
role_id
name
email
password


TABLE: students

id
user_id
class_id
nis


TABLE: teachers

id
user_id
nip


TABLE: classes

id
name
level


TABLE: subjects

id
code
name


TABLE: schedules

id
teacher_id
class_id
subject_id
day
start_time
end_time
status


TABLE: attendances

id
schedule_id
student_id
date
status


TABLE: grades

id
student_id
subject_id
teacher_id
score