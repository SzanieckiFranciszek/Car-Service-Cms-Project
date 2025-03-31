import styles from "./posts.module.scss";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../../../components/modal";
import {
  createPost,
  deletePost,
  getAllPosts,
  Post,
  updatePost,
} from "../../../../apiService";
import { useUserContext } from "../../../../contexts/UserContext";

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

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => Promise<void>;
  token: string;
}

interface Errors {
  [key: string]: string;
}

const NewPostModal = (props: NewPostModalProps) => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState<File | undefined>(undefined);

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!postTitle) {
      formIsValid = false;
      errors["title"] = "Podaj tytuł.";
    }

    if (!postContent) {
      formIsValid = false;
      errors["content"] = "Podaj treść.";
    }

    if(postImage !== undefined) {

      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(postImage.type)) {
        formIsValid = false;
        errors["file"] = "Dodaj plik typu PNG lub JPG.";
      }
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (validateForm()) {
      await createPost(postTitle, postContent, postImage);
      await props.onCreate();
      props.onClose();
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <form action="" className={styles.postModalMain}>
        <div className={styles.postModalHeader}>
          <p>Nowy post</p>
        </div>
        <div>
          <div className={styles.postModalInputWrapper}>
            <p>Zdjęcie (opcjonalne)</p>
            <input
              type="file"
              accept=".png, .jpg"
              onChange={(e) =>
                setPostImage(e.target.files ? e.target.files[0] : undefined)
              }
            />
            {errors.file && <p className={styles.inputAlert}>{errors.file}</p>}
          </div>
          <div className={styles.postModalInputWrapper}>
            <p>Tytuł</p>
            <input
              className={errors.title && styles.inputError}
              type="text"
              onChange={(e) => setPostTitle(e.target.value)}
            />
            {errors.title && (
              <p className={styles.inputAlert}>{errors.title}</p>
            )}
          </div>
          <div className={styles.postModalInputWrapper}>
            <p>Treść</p>
            <textarea
              className={errors.content && styles.inputError}
              name=""
              id=""
              onChange={(e) => setPostContent(e.target.value)}
            />
            {errors.content && (
              <p className={styles.inputAlert}>{errors.content}</p>
            )}
          </div>
        </div>
        <div className={styles.postModalButtonWrapper}>
          <button type="submit" onClick={handleSubmit}>
            Utwórz
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Post;
  onDelete: () => Promise<void>;
  onEdit: () => Promise<void>;
  token: string;
}

const PostModal = (props: PostModalProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const [postTitle, setPostTitle] = useState(props.data.title);
  const [postContent, setPostContent] = useState(props.data.content);
  const [postImage, setPostImage] = useState<File | undefined>(undefined);

  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    let formIsValid = true;
    const errors: Errors = {};

    if (!postTitle) {
      formIsValid = false;
      errors["title"] = "Podaj tytuł.";
    }

    if (!postContent) {
      formIsValid = false;
      errors["content"] = "Podaj treść.";
    }

    if(postImage !== undefined) {

      const validTypes = ["image/png", "image/jpeg"];
      if (!validTypes.includes(postImage.type)) {
        formIsValid = false;
        errors["file"] = "Dodaj plik typu PNG lub JPG.";
      }
    }

    setErrors(errors);
    return formIsValid;
  };

  const onEdit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsEdit(false);
    if (validateForm()) {
      const result = await updatePost(
        props.data.id,
        postTitle,
        postContent,
        postImage
      );
      if (result && (result.status === 200 || result.status === 204)) {
        props.onEdit();
      }
    }
  };

  const onDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const result = await deletePost(props.data.id);
    if (result && (result.status === 200 || result.status === 204)) {
      props.onDelete();
    }
  };

  const onEditCancel = () => {
    setIsEdit(false);
    setPostTitle(props.data.title);
  };

  const postDate = new Date(props.data.createdAt).toLocaleDateString()

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className={styles.postModalMain}>
        <div>
          <h2>Post</h2>
          <p>Data utworzenia: {postDate}</p>
        </div>
        <div className={styles.postModalContent}>
          <div className={styles.postModalInputWrapper}>
            <input
              disabled={!isEdit}
              value={postTitle}
              className={errors.title && styles.inputError}
              type="text"
              onChange={(e) => setPostTitle(e.target.value)}
            />
            {errors.title && (
              <p className={styles.inputAlert}>{errors.title}</p>
            )}
          </div>
          <div className={styles.postModalImageWrapper}>
            {props.data.photo && (
              <img src={`data:image;base64, ${props.data.photo}`} />
            )}
            {isEdit && (
              <input
                disabled={!isEdit}
                type="file"
                accept=".png, .jpg"
                onChange={(e) =>
                  setPostImage(e.target.files ? e.target.files[0] : undefined)
                }
              />
            )}
            {errors.file && <p className={styles.inputAlert}>{errors.file}</p>}
          </div>
          <div className={styles.postModalInputWrapper}>
            <textarea
              disabled={!isEdit}
              value={postContent}
              className={errors.content && styles.inputError}
              name=""
              id=""
              onChange={(e) => setPostContent(e.target.value)}
            />
            {errors.content && (
              <p className={styles.inputAlert}>{errors.content}</p>
            )}
          </div>
        </div>
        <div className={styles.postModalButtonWrapper}>
          {isEdit ? <button onClick={onEdit}>Zapisz</button> : null}
          {isEdit ? (
            <button onClick={onEditCancel}>Anuluj</button>
          ) : (
            <button onClick={() => setIsEdit(true)}>Edytuj</button>
          )}
          <button onClick={onDelete}>Usuń</button>
        </div>
      </div>
    </Modal>
  );
};

const Posts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const postId = searchParams.get("post-id");
  const { token } = useUserContext();

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
    const result = await getAllPosts();
    if (result) {
      setPosts(result);
    }
  };

  const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  const openNewPostModal = () => setNewPostModalOpen(true);
  const closeNewPostModal = () => setNewPostModalOpen(false);

  const openPostModal = (id: string) => {
    setSearchParams({ "post-id": id });
  };
  const closePostModal = () => {
    setPostModalOpen(false);
    setSearchParams({});
  };

  const onDelete = async () => {
    await fetchAllPosts();
  };

  const onEdit = async () => {
    await fetchAllPosts();
  };

  const onCreate = async () => {
    await fetchAllPosts();
  };

  const selectedPostData = posts.find((post) => post.id == postId);

  return (
    <div className={styles.main}>
      {isNewPostModalOpen && (
        <NewPostModal
          token={token}
          onCreate={onCreate}
          isOpen={isNewPostModalOpen}
          onClose={closeNewPostModal}
        />
      )}
      {isPostModalOpen && selectedPostData && (
        <PostModal
          token={token}
          onEdit={onEdit}
          onDelete={onDelete}
          isOpen={isPostModalOpen}
          onClose={closePostModal}
          data={selectedPostData}
        />
      )}
      <div className={styles.header}>
        <p>Lista postów:</p>
        <button onClick={openNewPostModal}>Dodaj nowy</button>
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
          <p>Brak postów</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
