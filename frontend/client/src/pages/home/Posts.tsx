import styles from "./posts.module.scss";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../components/modal";
import { Post } from "@shared/types";
import { PostsService } from "@shared/api/services";



interface PostProps {
  openPostModal: (id: string) => void;
  data: Post;
}
const PostElement = (props: PostProps) => {
  const postDate = props.data.createdAt
    ? new Date(props.data.createdAt)
    : null;
  const formattedDate = postDate && postDate.toLocaleDateString();
  const previewText =
    props.data.content.length > 255
      ? props.data.content.substring(0, 255) + "..."
      : props.data.content;

  return (
    <div
      className={styles.post}
      onClick={() => props.openPostModal(props.data.id)}
    >
      <div className={styles.postImg}>
        {props.data.photo && (
          <img src={`data:image;base64, ${props.data.photo}`} />
        )}
      </div>
      <div className={styles.postInnerWrapper}>
        <div className={styles.postTitle}>{props.data.title}</div>
        <div className={styles.postContent}>{previewText}</div>
        <div>{formattedDate}</div>
      </div>
    </div>
  );
};


interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Post;
}

const PostModal = (props: PostModalProps) => {

  const postDate = new Date(props.data.createdAt).toLocaleDateString()

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className={styles.postModalMain}>
        <div>
          <h2>{props.data.title}</h2>
          <p>Data utworzenia: {postDate}</p>
        </div>
        <div className={styles.postModalContent}>
          <div className={styles.postModalImageWrapper}>
            {props.data.photo && (
              <img src={`data:image;base64, ${props.data.photo}`} />
            )}
          </div>
          <div>
            {props.data.content}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Posts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const postId = searchParams.get("post-id");

  useEffect(() => {
    if (postId) {
      setPostModalOpen(true);
    }
  }, [postId]);

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    const result = await PostsService.getAllPosts();
    if (result) {
      setPosts(result);
    }
  };

 
  const [isPostModalOpen, setPostModalOpen] = useState(false);



  const openPostModal = (id: string) => {
    setSearchParams({ "post-id": id });
  };
  const closePostModal = () => {
    setPostModalOpen(false);
    setSearchParams({});
  };


  const selectedPostData = posts.find((post) => post.id == postId);

  return (
    <div className={styles.main}>
      {isPostModalOpen && selectedPostData && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={closePostModal}
          data={selectedPostData}
        />
      )}
      <div className={styles.header}>
        <h2>Aktualności</h2>
      </div>
      <div className={styles.posts}>
        {posts.length > 0 ? (
          posts.map((postData) => (
            <PostElement
              key={postData.id}
              openPostModal={openPostModal}
              data={postData}
            />
          ))
        ) : (
          <p>Brak aktualności</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
