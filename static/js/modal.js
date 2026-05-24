document.addEventListener('DOMContentLoaded', () => {
  let $sourceParent;
  // Functions to open and close a modal
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
      // $container.removeChild($source);
      $container.classList.remove('is-active');
      $sourceParent = null;
    }
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    const sourceId = $trigger.dataset.source;
    const $source = document.getElementById(sourceId);

    $trigger.addEventListener('click', () => {
      openModal($source, $target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      closeAllModals();
    }
  });
});
