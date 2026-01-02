
#include <iostream>
using namespace std;

/*
Simple Queue :
  problems : deleted Elements cant Be reused
  solution : Circular Queue

Delete ===> Front
Insert ===> Rear
==================================================
Circular Queue
Delete ===> Front
Insert ===> Rear
==================================================
Priority Queue

Delete ===> Priority, Front
Insert ===>  Rear
==================================================
Double Ended Queue
=============================
Input Restricted  [One Inertion , Both Delete]
insertRear();
deleteFront();
deleteRear();



Output Restricted
insertRear();
insertFront();
deleteFront();


Lab
-Deque (Double-Ended Queue)  using Circle
- void insertFront(int data) : Adding an element to the front.
- int deleteRear() : Removing an element from the back.
-Queu With Linkedlist

*/





class SimpleQueue{

    private:
    int front;
    int rear;
    int capacity;
    int *items;  // to point on first loc. in arr

    public:
    SimpleQueue(int userCapacity=10)
    {
        this->capacity= userCapacity;
        this->front=this->rear=-1;     // init at first
        if(capacity<=0) this->capacity=1; // to avoid items[0] ==>
        items = new int[capacity];  // dynamic arr
    }

    void addItem(int data)  //
    {
      // first iteam (front&rear -1)==> f&R 0 and iteam[rear] = data;
      // else  check if not full(rear<capacity-1)==> rear++; iteam[rear] = data;

      if(rear==capacity-1) return ; // Full Queue or Queue with size 0

      if(rear==-1)
      {
        front=rear=0;         // first element
      }
      else
      {
          rear++;
      }

      items[rear]=data;
    }

    void removeItem(void)  // my own implementation is to just replace the iteam[] with -99
    {
        if(front==-1) return ; // Empty Queue

        items[front]=-99; // deleteted
        front++;

        if(front>rear)     // if the queue became empty
            front=rear=-1;
    }


    void displayQueue(void) const
    {
        if(rear==-1)
            return ;
        for(int i=front;i<=rear;i++)  // from front to rear to show exiting iteam not deleted
        {
            cout<<items[i]<<"  ";
        }
        cout<<endl;
        cout<<"====================================="<<endl;
    }

    ~SimpleQueue()
    {
        delete [] items;
    }

};

/*


int main()
{
     SimpleQueue q;
     q.displayQueue();

     q.addItem(1);
     q.displayQueue();
     q.removeItem();
     q.displayQueue();
     q.addItem(11);
     q.addItem(111);
     q.addItem(1111);
     q.displayQueue();
     q.removeItem();
     q.displayQueue();
     q.addItem(11111);
     q.displayQueue();
     SimpleQueue e(0);
     e.addItem(12);
     e.displayQueue();

    return 0;
}
*/
