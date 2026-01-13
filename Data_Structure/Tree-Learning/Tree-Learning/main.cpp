#include <iostream>

using namespace std;

class Node
{

public:
    int data;
    Node* left;
    Node* right;


    Node(int data)
    {
        this->data=data;
        left=right=NULL;
    }

    ~Node()
    {

    }

};


class BST
{

private:
    Node* Root;

    Node* addTreeNodeHelper(Node* pnode,int data)   // tell me where i will stop by ret ptr
    {
        if(pnode==NULL)           // there is no tree orrrr the place is empty to insert your node
        {
            Node* newNode=new Node(data);
            pnode=newNode;
        }                            // there is a tree ??
        else if(data < pnode->data) // check if less
        {
            pnode->left=addTreeNodeHelper(pnode->left,data);  // put in the left
        }
        else                  // check if more or eq.
        {
            pnode->right= addTreeNodeHelper(pnode->right,data);   // put in right
        }
        return pnode;
    }


    void Pre_OrderTraverseHelper(Node* cnode)
    {
        // Root Left Right
        if(cnode==NULL) return;  // what if the tree is empty or (reached the after leaf)

        cout<<cnode->data<<"   ";
        Pre_OrderTraverseHelper(cnode->left);
        Pre_OrderTraverseHelper(cnode->right);
    }

    void In_OrderTraverseHelper(Node* cnode)
    {
        // Left root right
        if(cnode==NULL) return;

        In_OrderTraverseHelper(cnode->left);
        cout<<cnode->data<<"   ";
        In_OrderTraverseHelper(cnode->right);
    }

    void Post_OrderTraverseHelper(Node* cnode)
    {
        // Left  right root
        if(cnode==NULL) return;

        Post_OrderTraverseHelper(cnode->left);
        Post_OrderTraverseHelper(cnode->right);
        cout<<cnode->data<<"   ";
    }


    Node* SearchHelper(Node* cnode,int key)
    {

        if(cnode==NULL) return NULL;  // if tree is empty

        if(key==cnode->data) // if root is it then ret.
            return cnode;           //ret node i need
        else if(key<cnode->data) // go search in left
        {
            return SearchHelper(cnode->left,key);
        }
        else
        {
            return SearchHelper(cnode->right,key);
        }
    }

    Node* findMinHelper(Node* cnode)
    {
        if(cnode==NULL) return NULL; // check if tree is null

        if(cnode->left==NULL)     // if tree has no left subtree
            return cnode;
        else
            return findMinHelper(cnode->left);  // if has then go search in left and ret it
    }

    Node* findMaxHelper(Node* cnode)
    {
        if(cnode==NULL) return NULL; // check if tree is null

        if(cnode->right==NULL)     // if tree has no left subtree
            return cnode;
        else
            return findMaxHelper(cnode->right);  // if has then go search in left and ret it
    }

    Node* deleteNode(Node* cnode, int key)
    {
        if(cnode==NULL) return NULL;

        if(cnode->data > key)      // the key is in left side
        {
            cnode->left= deleteNode(cnode->left,key);
        }
        else if(cnode->data < key)  // key in right side
        {
            cnode->right= deleteNode(cnode->right,key);
        }
        else                        // key is the current node
        {
            if(cnode->left == NULL && cnode->right == NULL)  // has no child
            {
                delete cnode;
                cnode=NULL;
            }
            else if(cnode->left != NULL && cnode->right == NULL) // has 1 child (left)
            {
                cnode->data=cnode->left->data; // copy child to parent
                delete cnode->left; // delete child
                cnode->left= NULL;// child = null
            }
            else if(cnode->left == NULL && cnode->right != NULL) // has 1 child (right)
            {
                cnode->data=cnode->right->data; // copy child to parent
                delete cnode->right;
                cnode->right= NULL;// child = null

            }
            else  // Node has 2 children:: predesscor(Max at left) or successor (Min at right)
            {
                Node* Max=findMaxHelper(cnode->left);
                cnode->data=Max->data;
                cnode->left=deleteNode(cnode->left,Max->data);
            }
        }
        return cnode;
    }




public:


    BST()
    {
        Root=NULL;
    }

    void addTreeNode(int data)
    {
        Root=addTreeNodeHelper(Root,data);  // send empty tree and ret. with full tree and always updated with last values
    }


    void Pre_OrderTraverse(void)
    {
        Pre_OrderTraverseHelper(Root);
        cout<<endl<<"================================"<<endl;
    }


    void In_OrderTraverse(void)
    {
        In_OrderTraverseHelper(Root);
        cout<<endl<<"================================"<<endl;
    }

    void Post_OrderTraverse(void)
    {
        Post_OrderTraverseHelper(Root);
        cout<<endl<<"================================"<<endl;
    }


    bool Search(int key)
    {
        Node* res=SearchHelper(Root,key);
        if(res==NULL) return false;
        else return true;
    }

    int findMin(void)
    {
        Node* res=findMinHelper(Root);
        if(res==NULL) return -1;
        else return res->data;
    }

    int findMax(void)
    {
        Node* res=findMaxHelper(Root);
        if(res==NULL) return -1;
        else return res->data;
    }

    bool Delete(int key)
    {
        Node* res= deleteNode(Root,key);
        if(res==NULL) return false;
        else return true;
    }
    /*void addTreeNode(int data)
    {
        Node* newNode=new Node(data);
        if(Root==NULL)
        {
            Root=newNode;
            return ;
        }
        Node* current= Root;


        while(current!=NULL)
        {
            if(data>=current->data)  // right branch
            {
                current->right=newNode;
            }
            else                     // left branch
            {
                current->left=newNode;
            }
            current=current->next;
        }
    }*/

    ~BST()
    {

    }


};

int main()
{
    BST t;

    t.addTreeNode(45);
    t.addTreeNode(15);
    t.addTreeNode(79);
    t.addTreeNode(90);
    t.addTreeNode(10);
    t.addTreeNode(55);
    t.addTreeNode(12);
    t.addTreeNode(20);
    t.addTreeNode(50);
    t.Pre_OrderTraverse();
    t.In_OrderTraverse();
    t.Post_OrderTraverse();
    cout<<t.Search(45);
    cout<<t.Search(44);
    cout<<t.findMax()<<endl;
    cout<<t.findMin()<<endl;


    cout<<t.Delete(12)<<endl;
    t.Pre_OrderTraverse();
    cout<<t.Delete(44)<<endl;
    t.Pre_OrderTraverse();
    cout << "Hello world!" << endl;
    return 0;
}
