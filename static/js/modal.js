document.addEventListener('DOMContentLoaded', () => {
  let $sourceParent;

  function openModal($source, $target) {
    $target.classList.add('is-active');
    addElementIntoModal($source, $target);
  }

  function closeModal($el) {
    removeElementFromModal($el);
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  function addElementIntoModal($source, $target) {
    $container = $target.querySelector('.modal-container');
    $sourceParent = $source.parentNode;
    $container.appendChild($source);
    $container.classList.add('is-active');
  }

  function removeElementFromModal($target) {
    if ($sourceParent) {
      $container = $target.querySelector('.modal-container');
      $source = $container.firstChild;
      $sourceParent.appendChild($source);
      $container.classList.remove('is-active');
      $sourceParent = null;
    }
  }

  // Open modal on trigger click
  (document.querySelectorAll('.modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    const sourceId = $trigger.dataset.source;
    const $source = document.getElementById(sourceId);

    $trigger.addEventListener('click', () => {
      openModal($source, $target);
    });
  });

  // Close modal on any click that is not on the video element itself
  (document.querySelectorAll('.modal') || []).forEach(($modal) => {
    $modal.addEventListener('click', (e) => {
      if (e.target.tagName !== 'VIDEO') {
        closeModal($modal);
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });
});
