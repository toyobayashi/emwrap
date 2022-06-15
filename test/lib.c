#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

__attribute__((used))
int add(int a, int b) {
  return a + b;
}

void* f() {
  sleep(1);
  printf("Sleep 1\n");
  return NULL;
}

__attribute__((used))
void spawn() {
  pthread_t t;
  pthread_create(&t, NULL, f, NULL);
  // pthread_join(t, NULL);
  pthread_detach(t);
}
